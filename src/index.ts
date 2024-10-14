import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import symbolRoutes from './routes/symbolRoutes';
import orderbookRoutes from './routes/orderbookRoutes';
import balanceRoutes from './routes/balanceRoutes';
import tradeRoutes from './routes/tradeRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/balances', balanceRoutes);
app.use('/user', userRoutes);
app.use('/symbol', symbolRoutes);
app.use('/orderbook', orderbookRoutes);
app.use('/trade', tradeRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
