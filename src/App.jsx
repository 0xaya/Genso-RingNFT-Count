import React, { useState, useEffect } from "react";
import { useCrystalCounter } from "./hooks/useCrystalCounter";

const App = () => {
  const { loading, totalAmounts, ownerLabels } = useCrystalCounter();
  return (
    <main>
      <div className="mt-10">
        <h1 className="my-4">クリスタルの数</h1>
        {!loading ? (
          <table className="w-full mb-5 max-w-[600px]">
            <thead>
              <tr className="text-xs">
                <th>Type</th>
                <th>合成wallet</th>
                <th>出品中</th>
                <th>その他も含めた合計</th>
                <th>最安値</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(totalAmounts).map(([crystalName, data]) => (
                <tr key={crystalName}>
                  <td>{crystalName}</td>

                  {Object.entries(ownerLabels).map(([address, ownerLabel]) => {
                    if (data.owners[address] > 0) {
                      return <td key={ownerLabel}>{data.owners[address]}</td>;
                    } else {
                      return <td key={ownerLabel}>-</td>;
                    }
                  })}
                  <td>
                    <strong>{data.total}</strong>
                  </td>
                  <td className="text-small text-primary font-light whitespace-nowrap">
                    {data.lowestPrice.currentCurrency === "MV" ? (
                      <img src="MV.png" className="-mt-[2px] mr-1 w-4" />
                    ) : (
                      <img src="USDT.svg" className="-mt-[2px] mr-1 w-4" />
                    )}
                    {data.lowestPrice.currentUnitPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            <img src="loading-icon.svg" className="-mt-[3px] mr-1 w-6" />
            データ取得中...
          </div>
        )}
      </div>
      <div className="my-20">
        <h1 className="my-4">リングの数</h1>
        {!loading ? (
          <table className="w-full mb-5 max-w-[600px]">
            <thead>
              <tr>
                <th>Type</th>
                <th>合計</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(totalAmounts).map(([crystalName, data]) => (
                <tr key={crystalName}>
                  <td>{crystalName}</td>

                  {Object.entries(ownerLabels).map(([address, ownerLabel]) => {
                    if (
                      data.owners[address] > 0 &&
                      address === "0x5b00f8c66a9128549771a03abcfe3fd124abffdc"
                    ) {
                      return (
                        <td key={ownerLabel}>{data.owners[address] / 30}</td>
                      );
                    } else {
                      return;
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            <img src="loading-icon.svg" className="-mt-[2px] mr-1 w-6" />
            データ取得中...
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
