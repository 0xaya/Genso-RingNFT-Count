import React, { useEffect, useState } from "react";

export const useCrystalCounter = () => {
  const [totalAmounts, setTotalAmounts] = useState({});
  const [loading, setLoading] = useState(true);
  const OKLINK_API_KEY = "731144bb-b9b2-4fda-a895-63890346bb76";
  const crystalTypes = {
    生命: 161,
    魔力: 162,
    幸運: 164,
    腕力: 165,
    知力: 166,
    器用: 167,
    体力: 168,
    速さ: 169,
    精神: 170,
  };
  const ownerLabels = {
    "0x5b00f8c66a9128549771a03abcfe3fd124abffdc": "Create NFT",
    "0x973dce40e5408994020570b8e84a58b21450a7a6": "マケプレ出品中",
  };

  useEffect(() => {
    const fetchCrystalData = async () => {
      const amounts = {};
      const fetchAmounts = {};

      for (const [crystalName, tokenId] of Object.entries(crystalTypes)) {
        let currentPage = 1;
        let totalPage;
        let totalAmount = 0;
        let owners = {};
        const crystalNftId = `120000000${tokenId}0000000`;
        const crystalItemId = `20000000${tokenId}`;
        do {
          const params = {
            chainShortName: "POLYGON",
            tokenContractAddress: "0xa72815200ba44a2472b24ebe22e453e49904ec33",
            tokenId: crystalNftId,
            limit: "100",
            page: currentPage.toString(),
          };
          const queryString = new URLSearchParams(params).toString();
          const urlWithParams = `https://www.oklink.com/api/v5/explorer/nft/nft-owner-address?${queryString}`;

          try {
            const response = await fetch(urlWithParams, {
              method: "GET",
              headers: {
                Accept: "*/*",
                "Ok-Access-Key": OKLINK_API_KEY,
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const pageData = data.data[0];

            if (!pageData) {
              // No more pages
              break;
            }
            // console.log(pageData.positionList);
            const pageAmount = (pageData.positionList || []).reduce(
              (acc, position) => {
                const amount = parseInt(position.amount, 10);
                const ownerAddress = position.ownerAddress;

                return acc + amount;
              },
              0,
            );
            owners =
              pageData.positionList?.reduce((acc, position) => {
                const amount = parseInt(position.amount, 10);
                const ownerAddress = position.ownerAddress;

                // Update total amount for crystal type
                if (!amounts[crystalName]) {
                  amounts[crystalName] = {};
                }

                if (ownerLabels[ownerAddress]) {
                  if (!amounts[crystalName][ownerAddress]) {
                    amounts[crystalName][ownerAddress] = 0;
                  }

                  amounts[crystalName][ownerAddress] += amount;

                  // Update owners object for this crystal type
                  if (!acc[ownerAddress]) {
                    acc[ownerAddress] = 0;
                  }

                  acc[ownerAddress] += amount;
                }

                return acc;
              }, {}) || {};

            totalAmount += pageAmount;
            totalPage = parseInt(pageData.totalPage, 10);
            currentPage++;
          } catch (error) {
            console.log("Error fetching crystal data:", error);
          }

          // Introduce a delay between requests (e.g., 1 second)
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } while (currentPage <= totalPage);

        const lowestPrice = await getCrystalLowestPrice(crystalItemId);

        setTotalAmounts((prevAmounts) => {
          const updatedAmounts = { ...prevAmounts };
          updatedAmounts[crystalName] = {
            crystalItemId: crystalItemId,
            total: totalAmount, // Include the totalAmount in the amounts object
            lowestPrice: lowestPrice,
            owners: owners, // Set the owners object for this crystal type
          };
          return updatedAmounts;
        });
      }

      setLoading(false);
      // console.log(totalAmounts);
    };

    fetchCrystalData();
  }, []); // Make sure to include any dependencies if needed

  const getCrystalLowestPrice = async (crystalItemId) => {
    const url = `https://api-market.genso.game/api/market/consumption?page=1&itemType=consumption_item&rarity=&sort=lowest&status=&limit=12&search=${crystalItemId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {},
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data.sellingOrders[0]);
      return {
        currentCurrency: data.sellingOrders[0].currentCurrency,
        currentUnitPrice: data.sellingOrders[0].currentUnitPrice,
      };
    } catch (error) {
      console.log(
        `Error fetching the lowest price for ${crystalItemId}:`,
        error,
      );
    }
  };

  return {
    loading,
    totalAmounts,
    ownerLabels,
  };
};
