import express from 'express';
import * as RepairShopPeer from '../blockchain/repairShopPeer';

const router = express.Router();

router.post('/api/all-files', async (req, res) => {
  try {
    let repairOrders = await RepairShopPeer.getAllFiles();
    res.json(repairOrders);
  } catch (e) {
    console.log(e);
    res.json({ error: "Error accessing blockchain."});
  }
});

router.post('/api/request-file', async (req, res) => {
  const {fileId,owner } = req.body;
  // if (typeof uuid !== 'string') {
  //   res.json({ error: "Invalid request." });
  //   return;
  // }

  try {
    await RepairShopPeer.requestFile(fileId,owner);
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.json({ error: "Error request file." });
  }
});

router.post('/api/blocks', async (req, res) => {
  const { noOfLastBlocks } = req.body;
  if (typeof noOfLastBlocks !== 'number') {
    res.json({ error: 'Invalid request' });
  }
  try {
    const blocks = await RepairShopPeer.getBlocks(noOfLastBlocks);
    res.json(blocks);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

router.post('/api/upload-gene', async (req, res) => {
  const { gene_list } = req.body;
  // if (Array.isArray(gene_list)) {
  //   res.json({ error: 'Invalid request from upload-gene' });
  // }
  console.log(gene_list)
  console.log(typeof gene_list) //object
  try {
    const blocks = await RepairShopPeer.uploadGene(gene_list);
    res.json(blocks);
  } catch (e) {
    console.log(e)
    res.json({ error: 'Error accessing blockchain when upload-gene' });
  }
});

router.get('*', (req, res) => {
  res.render('medical-center', { repairShopActive: true });
});

function wsConfig(io) {
  RepairShopPeer.on('block', block => { io.emit('block', block); });
}

export default router;
export { wsConfig };
