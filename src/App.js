import "./styles.css";
import React, { useEffect, useState } from "react";

export default function App() {
  const [beers, setBeers] = useState([]);

  const fetchData = async () => {
    const allBeerRes = await fetch(
      "https://thecocktaildb.com/api/json/v1/1/search.php?s=cock"
    );
    const allBeer = await allBeerRes.json();

    const data = [];
    allBeer.drinks.forEach((item) => {
      data.push({
        alcohol: item.strAlcoholic,
        drink: null,
        instructions: item.strInstructions
        //drink:item.strDrink
      });
    });

    const drinkByIdResult = await Promise.allSettled(
      allBeer.drinks.map((item) => {
        return fetch(
          `https://thecocktaildb.com/api/json/v1/1/lookup.php?i=${item.idDrink}`
        );
      })
    );
    const drinkById = await Promise.allSettled(
      drinkByIdResult.map((item) => {
        return item.value.json();
      })
    );

    drinkById.forEach((item, index) => {
      if (item.status === "fulfilled") {
        data[index] = { ...data[index], drink: item.value.drinks[0].strDrink };
      }
    });
    setBeers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      {beers.map((item) => {
        return (
          <>
            <div>
              {item.drink}------{item.alcohol}-------{item.instructions}
            </div>
            <br />
          </>
        );
      })}
    </div>
  );
}
