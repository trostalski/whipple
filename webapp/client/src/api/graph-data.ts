import { SearchState } from "../components/old_search/SearchReducer";

export const fetchUrl = async (url: string) => {
  {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.log(error);
    }
  }
};

export const fetchSearchServer = async (searchStates: SearchState[]) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchStates),
    });
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.log(error);
  }
};
