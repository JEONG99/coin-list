import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import {
  accTradePriceSortAtom,
  prevClosingPriceSortAtom,
  tradePriceSortAtom,
} from "../lib/util";
import CoinItem from "./CoinItem";

const CoinListBlock = styled.div`
  width: 100%;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
`;
const CoinTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const CoinList = ({ coins, price }) => {
  const [tradePriceSort] = useAtom(tradePriceSortAtom);
  const [prevClosingPriceSort] = useAtom(prevClosingPriceSortAtom);
  const [accTradePriceSort] = useAtom(accTradePriceSortAtom);

  const getSortedList = () => {
    if (tradePriceSort) {
      if (tradePriceSort === "ascending") {
        return coins.sort((a, b) => a.trade_price - b.trade_price);
      } else {
        return coins.sort((a, b) => b.trade_price - a.trade_price);
      }
    } else if (prevClosingPriceSort) {
      if (prevClosingPriceSort === "ascending") {
        return coins.sort(
          (a, b) => a.signed_change_rate - b.signed_change_rate
        );
      } else {
        return coins.sort(
          (a, b) => b.signed_change_rate - a.signed_change_rate
        );
      }
    } else {
      if (accTradePriceSort === "ascending") {
        return coins.sort(
          (a, b) => a.acc_trade_price_24h - b.acc_trade_price_24h
        );
      } else {
        return coins.sort(
          (a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h
        );
      }
    }
  };

  if (!coins)
    return (
      <CoinListBlock>
        <div>loading....</div>
      </CoinListBlock>
    );
  return (
    <CoinListBlock>
      <CoinTable>
        <colgroup>
          <col width="26" />
          <col width="26" />
          <col width="94" />
          <col width="98" />
          <col width="58" />
          <col width="*" />
        </colgroup>
        <tbody>
          {getSortedList().map((coin) => {
            return <CoinItem coin={coin} key={coin.market} price={price} />;
          })}
        </tbody>
      </CoinTable>
    </CoinListBlock>
  );
};

export default React.memo(CoinList);
