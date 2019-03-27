import express from 'express';
import * as InsurancePeer from '../blockchain/insurancePeer';

const router = express.Router();

router.post('/api/my-request', async (req, res) => {
  try {
    let repairOrders = await InsurancePeer.getMyRequest();
    res.json(repairOrders);
  } catch (e) {
    console.log(e);
    res.json({ error: "Error accessing blockchain."});
  }
});

router.post('/api/complete-repair-order', async (req, res) => {
  const { uuid } = req.body;
  // if (typeof uuid !== 'string') {
  //   res.json({ error: "Invalid request." });
  //   return;
  // }

  try {
    await InsurancePeer.completeCalculationClaim(uuid);
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.json({ error: "Error accessing blockchain." });
  }
});

router.post('/api/blocks', async (req, res) => {
  const { noOfLastBlocks } = req.body;
  if (typeof noOfLastBlocks !== 'number') {
    res.json({ error: 'Invalid request' });
  }
  try {
    const blocks = await InsurancePeer.getBlocks(noOfLastBlocks);
    res.json(blocks);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

router.get('*', (req, res) => {
  res.render('calculation-center', { CalculationActive: true });
});

function wsConfig(io) {
  InsurancePeer.on('block', block => { io.emit('block', block); });
}

export default router;
export { wsConfig };
