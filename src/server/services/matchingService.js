const fs = require('fs/promises');
const path = require('path');

const { env } = require('./env');
const { uploadRoot } = require('./upload.service');

const imageSignatureCache = new Map();
const textEmbeddingCache = new Map();

let embeddingPipelinePromise = null;
let sharpModule = null;
let transformersModule = null;

function getSharp() {
  if (!sharpModule) {
    sharpModule = require('sharp');
  }

  return sharpModule;
}

function getTransformers() {
  if (!transformersModule) {
    transformersModule = require('@xenova/transformers');
  }

  return transformersModule;
}

async function getEmbeddingPipeline() {
  if (!embeddingPipelinePromise) {
    const { pipeline } = getTransformers();
    embeddingPipelinePromise = pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
  }

  return embeddingPipelinePromise;
}

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSemanticText(item) {
  return normalizeText([
    item.title || '',
    item.description || '',
    item.category || '',
    item.location || '',
  ].filter(Boolean).join('. '));
}

function keywordOverlapSimilarity(textA, textB) {
  const tokensA = new Set(normalizeText(textA).split(' ').filter(Boolean));
  const tokensB = new Set(normalizeText(textB).split(' ').filter(Boolean));
  const union = new Set([...tokensA, ...tokensB]);

  if (union.size === 0) {
    return 0;
  }

  let commonCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      commonCount += 1;
    }
  }

  return commonCount / union.size;
}

function cosineSimilarity(vectorA, vectorB) {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i += 1) {
    dot += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function meanPoolEmbedding(output) {
  // transformers.js feature-extraction output genelde [tokens][dims]
  // veya [1][tokens][dims] olabilir
  const data = output?.data ?? output;

  if (!data) {
    return null;
  }

  let matrix = data;

  if (Array.isArray(matrix) && Array.isArray(matrix[0]) && Array.isArray(matrix[0][0])) {
    matrix = matrix[0];
  }

  if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
    return null;
  }

  const tokenCount = matrix.length;
  const dimension = matrix[0].length;

  if (!tokenCount || !dimension) {
    return null;
  }

  const pooled = new Array(dimension).fill(0);

  for (const tokenVector of matrix) {
    for (let i = 0; i < dimension; i += 1) {
      pooled[i] += tokenVector[i];
    }
  }

  for (let i = 0; i < dimension; i += 1) {
    pooled[i] /= tokenCount;
  }

  return pooled;
}

async function getTextEmbedding(text) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return null;
  }

  if (textEmbeddingCache.has(normalized)) {
    return textEmbeddingCache.get(normalized);
  }

  const extractor = await getEmbeddingPipeline();
  const output = await extractor(normalized, {
    pooling: 'mean',
    normalize: true,
  });

  let embedding = null;

  if (output?.data && !Array.isArray(output.data[0])) {
    embedding = Array.from(output.data);
  } else {
    embedding = meanPoolEmbedding(output);
  }

  textEmbeddingCache.set(normalized, embedding);
  return embedding;
}

async function textSimilarity(itemA, itemB) {
  const textA = buildSemanticText(itemA);
  const textB = buildSemanticText(itemB);

  if (!textA || !textB) {
    return 0;
  }

  const [embeddingA, embeddingB] = await Promise.all([
    getTextEmbedding(textA),
    getTextEmbedding(textB),
  ]);

  if (!embeddingA || !embeddingB) {
    return 0;
  }

  return Number(Math.max(0, Math.min(1, cosineSimilarity(embeddingA, embeddingB))).toFixed(4));
}

function categoryMatch(itemA, itemB) {
  const categoryA = normalizeText(itemA.category);
  const categoryB = normalizeText(itemB.category);

  return categoryA !== '' && categoryA === categoryB ? 1 : 0;
}

function tokenizeLocation(location) {
  return normalizeText(location)
    .split(' ')
    .filter(Boolean);
}

function jaccardSimilarity(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const union = new Set([...set1, ...set2]);

  if (union.size === 0) {
    return 0;
  }

  let commonCount = 0;
  for (const value of set1) {
    if (set2.has(value)) {
      commonCount += 1;
    }
  }

  return commonCount / union.size;
}

function locationSimilarity(locationA, locationB) {
  return jaccardSimilarity(
    tokenizeLocation(locationA),
    tokenizeLocation(locationB)
  );
}

function recencyScore(createdAtA, createdAtB) {
  const timeA = new Date(createdAtA).getTime();
  const timeB = new Date(createdAtB).getTime();

  if (Number.isNaN(timeA) || Number.isNaN(timeB)) {
    return 0.5;
  }

  const diffDays = Math.abs(timeA - timeB) / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) return 1.0;
  if (diffDays <= 3) return 0.9;
  if (diffDays <= 7) return 0.75;
  if (diffDays <= 14) return 0.55;
  if (diffDays <= 30) return 0.35;
  return 0.15;
}

function generateReasons(item, candidate, details) {
  const reasons = [];

  if (details.categoryMatched) {
    reasons.push('Same category');
  }

  if (details.textSim >= 0.55) {
    reasons.push('Semantically similar description');
  }

  if (details.locationSim >= 0.5) {
    reasons.push('Close location');
  }

  if (details.recency >= 0.75) {
    reasons.push('Close posting dates');
  }

  if (details.imageSim !== null && details.imageSim >= 0.5) {
    reasons.push('Similar image appearance');
  }

  if (
    reasons.length === 0 &&
    (
      details.textSim >= 0.35 ||
      (details.imageSim !== null && details.imageSim >= 0.45)
    )
  ) {
    reasons.push('Some similarity detected');
  }

  return reasons;
}

function hammingDistance(hashA, hashB) {
  if (!hashA || !hashB || hashA.length !== hashB.length) {
    return hashA === hashB ? 0 : Number.MAX_SAFE_INTEGER;
  }

  let distance = 0;

  for (let i = 0; i < hashA.length; i += 1) {
    if (hashA[i] !== hashB[i]) {
      distance += 1;
    }
  }

  return distance;
}

function buildAverageHashFromPixels(pixelBuffer) {
  if (!pixelBuffer || pixelBuffer.length === 0) {
    return null;
  }

  const total = pixelBuffer.reduce((sum, value) => sum + value, 0);
  const average = total / pixelBuffer.length;

  return Array.from(pixelBuffer, (value) => (value >= average ? '1' : '0')).join('');
}

function buildDifferenceHashFromPixels(pixelBuffer, width, height) {
  if (!pixelBuffer || pixelBuffer.length !== width * height) {
    return null;
  }

  const bits = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const left = pixelBuffer[(y * width) + x];
      const right = pixelBuffer[(y * width) + x + 1];
      bits.push(left >= right ? '1' : '0');
    }
  }

  return bits.join('');
}

function buildColorHistogram(pixelBuffer, channels) {
  if (!pixelBuffer || !channels || channels < 3) {
    return null;
  }

  const binsPerChannel = 4;
  const histogram = new Array(binsPerChannel * 3).fill(0);
  const pixelCount = pixelBuffer.length / channels;

  if (pixelCount === 0) {
    return null;
  }

  for (let i = 0; i < pixelBuffer.length; i += channels) {
    const r = pixelBuffer[i];
    const g = pixelBuffer[i + 1];
    const b = pixelBuffer[i + 2];

    const rBin = Math.min(3, Math.floor(r / 64));
    const gBin = Math.min(3, Math.floor(g / 64));
    const bBin = Math.min(3, Math.floor(b / 64));

    histogram[rBin] += 1;
    histogram[4 + gBin] += 1;
    histogram[8 + bBin] += 1;
  }

  return histogram.map((value) => value / pixelCount);
}

function compareColorHistograms(histA, histB) {
  if (!histA || !histB || histA.length !== histB.length) {
    return null;
  }

  let distance = 0;

  for (let i = 0; i < histA.length; i += 1) {
    distance += Math.abs(histA[i] - histB[i]);
  }

  const maxDistance = 6;
  const similarity = 1 - (distance / maxDistance);

  return Math.max(0, Math.min(1, similarity));
}

function enhanceImageSimilarity(similarity) {
  if (similarity === null || similarity === undefined) {
    return null;
  }

  const contrasted = 0.5 + ((similarity - 0.5) * 1.4);
  return Number(Math.max(0, Math.min(1, contrasted)).toFixed(4));
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getImageSignature(imagePath) {
  if (!imagePath) {
    return null;
  }

  if (imageSignatureCache.has(imagePath)) {
    return imageSignatureCache.get(imagePath);
  }

  const absolutePath = path.join(uploadRoot, imagePath);
  const exists = await fileExists(absolutePath);

  if (!exists) {
    imageSignatureCache.set(imagePath, null);
    return null;
  }

  try {
    const sharp = getSharp();

    const averageHashBuffer = await sharp(absolutePath)
      .autoOrient()
      .resize(16, 16, { fit: 'cover', position: 'centre' })
      .grayscale()
      .raw()
      .toBuffer();

    const differenceHashBuffer = await sharp(absolutePath)
      .autoOrient()
      .resize(17, 16, { fit: 'cover', position: 'centre' })
      .grayscale()
      .raw()
      .toBuffer();

    const { data: colorData, info: colorInfo } = await sharp(absolutePath)
      .autoOrient()
      .resize(16, 16, { fit: 'cover', position: 'centre' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const signature = {
      averageHash: buildAverageHashFromPixels(averageHashBuffer),
      differenceHash: buildDifferenceHashFromPixels(differenceHashBuffer, 17, 16),
      colorHistogram: buildColorHistogram(colorData, colorInfo.channels),
    };

    imageSignatureCache.set(imagePath, signature);
    return signature;
  } catch (error) {
    imageSignatureCache.set(imagePath, null);
    return null;
  }
}

async function imageSimilarity(imagePathA, imagePathB) {
  if (!imagePathA || !imagePathB) {
    return null;
  }

  const [signatureA, signatureB] = await Promise.all([
    getImageSignature(imagePathA),
    getImageSignature(imagePathB),
  ]);

  if (!signatureA || !signatureB) {
    return null;
  }

  const averageHashSim = signatureA.averageHash && signatureB.averageHash
    ? 1 - (hammingDistance(signatureA.averageHash, signatureB.averageHash) / signatureA.averageHash.length)
    : null;

  const differenceHashSim = signatureA.differenceHash && signatureB.differenceHash
    ? 1 - (hammingDistance(signatureA.differenceHash, signatureB.differenceHash) / signatureA.differenceHash.length)
    : null;

  const colorSim = compareColorHistograms(signatureA.colorHistogram, signatureB.colorHistogram);

  const parts = [];

  if (averageHashSim !== null) {
    parts.push({ value: averageHashSim, weight: 0.30 });
  }

  if (differenceHashSim !== null) {
    parts.push({ value: differenceHashSim, weight: 0.45 });
  }

  if (colorSim !== null) {
    parts.push({ value: colorSim, weight: 0.25 });
  }

  if (parts.length === 0) {
    return null;
  }

  const totalWeight = parts.reduce((sum, part) => sum + part.weight, 0);
  const weightedScore = parts.reduce((sum, part) => sum + (part.value * part.weight), 0);
  const rawSimilarity = totalWeight > 0 ? weightedScore / totalWeight : 0;

  return Number(Math.max(0, Math.min(1, rawSimilarity)).toFixed(4));
}

async function scoreMatchStage1(item, candidate) {
  const textSim = await textSimilarity(item, candidate);
  const locationSim = locationSimilarity(item.location, candidate.location);
  const categoryMatched = categoryMatch(item, candidate);
  const recency = recencyScore(item.createdAt, candidate.createdAt);

  const stage1Score =
    (0.50 * textSim) +
    (0.25 * categoryMatched) +
    (0.15 * locationSim) +
    (0.10 * recency);

  return {
    stage1Score: Number(stage1Score.toFixed(4)),
    textSim,
    locationSim,
    categoryMatched: Boolean(categoryMatched),
    recency,
  };
}

async function scoreMatchStage2(item, candidate, stage1Details) {
  const rawImageSim = await imageSimilarity(item.imagePath, candidate.imagePath);
  const adjustedImageSim = enhanceImageSimilarity(rawImageSim);

  let finalScore = stage1Details.stage1Score;

if (adjustedImageSim !== null) {
  finalScore =
    (0.20 * stage1Details.stage1Score) +
    (0.80 * adjustedImageSim);
}
  finalScore = Number(finalScore.toFixed(4));

  const details = {
    ...stage1Details,
    imageSim: rawImageSim,
    adjustedImageSim,
  };

  return {
    score: finalScore,
    reasons: generateReasons(item, candidate, details),
    matchedFields: {
      category: details.categoryMatched,
      location: details.locationSim >= 0.5,
      textSimilarity: Number(details.textSim.toFixed(4)),
      imageSimilarity: details.imageSim,
      adjustedImageSimilarity: details.adjustedImageSim,
      stage1Score: details.stage1Score,
    },
  };
}

async function getStubMatchesForItem({ itemId, itemModel, limit = 10 }) {
  const item = await itemModel.findItemById(itemId);

  if (!item) {
    const error = new Error('Item not found');
    error.statusCode = 404;
    throw error;
  }

  if (item.status === 'removed') {
    const error = new Error('Removed item cannot be matched');
    error.statusCode = 400;
    throw error;
  }

  const oppositeType = item.itemType === 'lost' ? 'found' : 'lost';
  const candidates = await itemModel.findMatchCandidates({
    itemType: oppositeType,
    status: 'open',
    excludeItemId: item.id,
  });

  const matches = candidates
    .map((candidate) => {
      const textSim = keywordOverlapSimilarity(
        buildSemanticText(item),
        buildSemanticText(candidate)
      );
      const locationSim = locationSimilarity(item.location, candidate.location);
      const categoryMatched = Boolean(categoryMatch(item, candidate));
      const recency = recencyScore(item.createdAt, candidate.createdAt);
      const score = Number(
        Math.min(
          0.95,
          (
            (categoryMatched ? 0.35 : 0) +
            (0.45 * textSim) +
            (0.20 * locationSim)
          )
        ).toFixed(4)
      );

      return {
        itemId: candidate.id,
        score,
        reasons: generateReasons(item, candidate, {
          categoryMatched,
          textSim,
          locationSim,
          recency,
          imageSim: null,
        }),
        matchedFields: {
          category: categoryMatched,
          location: locationSim >= 0.5,
          textSimilarity: Number(textSim.toFixed(4)),
          imageSimilarity: null,
          adjustedImageSimilarity: null,
          stage1Score: score,
        },
        item: {
          id: candidate.id,
          ownerId: candidate.ownerId,
          itemType: candidate.itemType,
          title: candidate.title,
          description: candidate.description,
          category: candidate.category,
          location: candidate.location,
          status: candidate.status,
          imagePath: candidate.imagePath,
          createdAt: candidate.createdAt,
          updatedAt: candidate.updatedAt,
        },
      };
    })
    .filter((match) => match.score >= 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    sourceItemId: item.id,
    sourceItemType: item.itemType,
    matches,
  };
}

async function getMatchesForItem({ itemId, itemModel, limit = 10 }) {
  if (env.matchingMode === 'stub') {
    return getStubMatchesForItem({ itemId, itemModel, limit });
  }

  const item = await itemModel.findItemById(itemId);

  if (!item) {
    const error = new Error('Item not found');
    error.statusCode = 404;
    throw error;
  }

  if (item.status === 'removed') {
    const error = new Error('Removed item cannot be matched');
    error.statusCode = 400;
    throw error;
  }

  const oppositeType = item.itemType === 'lost' ? 'found' : 'lost';

  const candidates = await itemModel.findMatchCandidates({
    itemType: oppositeType,
    status: 'open',
    excludeItemId: item.id,
  });

  const stage1Candidates = await Promise.all(
    candidates.map(async (candidate) => {
      const stage1Details = await scoreMatchStage1(item, candidate);
      return { candidate, stage1Details };
    })
  );

  const stage1Matches = stage1Candidates
    .filter(({ stage1Details }) => stage1Details.stage1Score >= 0.15)
    .sort((a, b) => b.stage1Details.stage1Score - a.stage1Details.stage1Score)
    .slice(0, 10);

  const matches = await Promise.all(
    stage1Matches.map(async ({ candidate, stage1Details }) => {
      const result = await scoreMatchStage2(item, candidate, stage1Details);

      return {
        itemId: candidate.id,
        score: result.score,
        reasons: result.reasons,
        matchedFields: result.matchedFields,
        item: {
          id: candidate.id,
          ownerId: candidate.ownerId,
          itemType: candidate.itemType,
          title: candidate.title,
          description: candidate.description,
          category: candidate.category,
          location: candidate.location,
          status: candidate.status,
          imagePath: candidate.imagePath,
          createdAt: candidate.createdAt,
          updatedAt: candidate.updatedAt,
        },
      };
    })
  );

  const filteredMatches = matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    sourceItemId: item.id,
    sourceItemType: item.itemType,
    matches: filteredMatches,
  };
}

module.exports = {
  getMatchesForItem,
};
