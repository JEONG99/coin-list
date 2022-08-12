import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { useInterval } from "../hooks/useInterval";
import { coinsAtom, marketsAtom } from "../lib/coins";
import {
  accTradePriceSortAtom,
  prevClosingPriceSortAtom,
  tradePriceSortAtom,
} from "../lib/util";
import CoinList from "./CoinList";
import Header from "./Header";
import TableToSortList from "./TableToSortList";

const CoinTemplateBlock = styled.div`
  width: 400px;
  border: 1px solid #d4d6dc;
  margin: 10px auto;
`;

const CoinTemplate = () => {
  const [markets, setMarkets] = useAtom(marketsAtom);
  const [coins, setCoins] = useAtom(coinsAtom);
  const [tradePriceSort, setTradePriceSort] = useAtom(tradePriceSortAtom);
  const [prevClosingPriceSort, setPrevClosingPriceSort] = useAtom(
    prevClosingPriceSortAtom
  );
  const [accTradePriceSort, setAccTradePriceSort] = useAtom(
    accTradePriceSortAtom
  );

  const [btcPrice, setBtcPrice] = useState(null);
  const [, setLoading] = useState(false);

  const getMarkets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("../v1/market/all");
      setMarkets(response.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, [setMarkets]);

  const getCoins = useCallback(async () => {
    setLoading(true);
    let params = markets.map(({ market }) => market).join(",");
    try {
      const response = await axios.get(`../v1/ticker?markets=${params}`);
      setCoins(response.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, [setCoins, markets]);

  const sortByTradePrice = () => {
    if (tradePriceSort) {
      if (tradePriceSort === "ascending") {
        setTradePriceSort("descending");
      } else {
        setTradePriceSort("ascending");
      }
    } else {
      setPrevClosingPriceSort(null);
      setAccTradePriceSort(null);
      setTradePriceSort("descending");
    }
  };
  const sortByPrevClosingPrice = () => {
    if (prevClosingPriceSort) {
      if (prevClosingPriceSort === "ascending") {
        setPrevClosingPriceSort("descending");
      } else {
        setPrevClosingPriceSort("ascending");
      }
    } else {
      setTradePriceSort(null);
      setAccTradePriceSort(null);
      setPrevClosingPriceSort("descending");
    }
  };
  const sortByAccTradePrice = () => {
    if (accTradePriceSort) {
      if (accTradePriceSort === "ascending") {
        setAccTradePriceSort("descending");
      } else {
        setAccTradePriceSort("ascending");
      }
    } else {
      setTradePriceSort(null);
      setPrevClosingPriceSort(null);
      setAccTradePriceSort("descending");
    }
  };

  useEffect(() => {
    getMarkets();
  }, [getMarkets]);
  useInterval(getMarkets, 5000);

  useEffect(() => {
    if (markets) {
      getCoins();
    }
  }, [markets, getCoins]);

  useEffect(() => {
    if (coins) {
      setBtcPrice(coins.find((coin) => coin.market === "KRW-BTC").trade_price);
    }
  }, [coins, setBtcPrice]);

  return (
    <CoinTemplateBlock>
      <Header />
      <TableToSortList
        sortByTradePrice={sortByTradePrice}
        sortByPrevClosingPrice={sortByPrevClosingPrice}
        sortByAccTradePrice={sortByAccTradePrice}
      />
      {coins ? (
        <Routes>
          <Route
            path="/"
            element={
              <CoinList
                coins={coins.filter(({ market }) => market.startsWith("KRW"))}
                price={1}
              />
            }
          />
          <Route
            path="/BTC"
            element={
              <CoinList
                coins={coins.filter(({ market }) => market.startsWith("BTC"))}
                price={btcPrice}
              />
            }
          />
          <Route
            path="/USDT"
            element={
              <CoinList
                coins={coins.filter(({ market }) => market.startsWith("USDT"))}
                price={1301.35}
              />
            }
          />
        </Routes>
      ) : (
        <div>loading...</div>
      )}
    </CoinTemplateBlock>
  );
};

export default CoinTemplate;
