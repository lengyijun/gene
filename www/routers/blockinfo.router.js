import express from 'express';
import * as RepairShopPeer from '../blockchain/repairShopPeer';

const router = express.Router();

router.post('/api/getblock-by-id', async (req, res) => {
  try {
    const {id } =req.body
    let repairOrders = await RepairShopPeer.getBlockById(id);
    // console.log("blockinforouter")
    // console.log(repairOrders)
    res.json(repairOrders);
  } catch (e) {
    console.log(e);
    res.json({ error: "Error accessing blockchain."});
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

router.get('*', (req, res) => {
  res.render('block-info', { BlockInfoActive: true });
});

function wsConfig(io) {
  RepairShopPeer.on('block', block => { io.emit('block', block); });
}

export default router;
export { wsConfig };
