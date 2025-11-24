const express = require('express');
const ViewController = require('../controllers/ViewController');

const router = express.Router();

// 메인 페이지
router.get('/', ViewController.renderIndex);

// 상태 확인
router.get('/status', ViewController.renderStatus);

module.exports = router;
