import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import symbolRoutes from './routes/symbolRoutes';
import orderbookRoutes from './routes/orderbookRoutes';
import balanceRoutes from './routes/balanceRoutes';
import tradeRoutes from './routes/tradeRoutes';
import resetRouter from './routes/resetRouter';
import onrampRouter from './routes/onrampRouter';
import orderRoutes from './routes/orderRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/balances', balanceRoutes);
app.use('/user', userRoutes);
app.use('/symbol', symbolRoutes);
app.use('/orderbook', orderbookRoutes);
app.use('/order', orderRoutes);
app.use('/trade', tradeRoutes);
app.use('/reset', resetRouter);
app.use('/onramp', onrampRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
export default app;