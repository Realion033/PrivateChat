const express = require('express');
const ViewController = require('../controllers/ViewController');
const GifController = require('../controllers/GifController');

const router = express.Router();

// 메인 페이지
router.get('/', ViewController.renderIndex);

// 상태 확인
router.get('/status', ViewController.renderStatus);

// GIF 검색 API
router.get('/api/gif/search', GifController.search);

module.exports = router;
