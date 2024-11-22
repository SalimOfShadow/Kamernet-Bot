import { Settings } from "../bot";
import {
  possibleDimensions,
  possiblePrices,
  possibleRadii,
} from "../utils/validateSettings";

export function searchListings(settings: Settings, selectedLocation: string) {
  // Parsing the location
  const location: string = selectedLocation.replace(" ", "-");

  // Parsing the listing type
  const listingTypeArray: string[] = settings.listingType;
  const listingTypeString = listingTypeArray
    // %2C is the escape ASCII keycode for a comma (" , ")
    // 1 is Room - 2 is Apartment - 4 is Studio - 16 is Student Housing - 8 is Anti-squat
    .map((type) => {
      switch (type) {
        case "room":
          return "%2C1";
        case "apartment":
          return "%2C2";
        case "studio":
          return "%2C4";
        case "student-housing":
          return "";
        case "anti-squat":
          return "8";
        default:
          return "";
      }
    })
    .join("");

  // Parsing the maximum price
  const maxPrice: string = possiblePrices
    .findIndex((price) => price === settings.maxPrice)
    .toString();

  // Parsing the min square meters area
  const minSize: string = (
    possibleDimensions.findIndex(
      (dimension) => dimension === settings.minSize
    ) + 1
  ).toString();

  // Parsing the area radius
  const radius: string = (
    possibleRadii.findIndex((radius) => radius === settings.radius) + 1
  ).toString();

  const searchLink: string =
    /*pageNo=1&sort=1*/
    `https://kamernet.nl/en/for-rent/properties-${location}?listingTypes=${listingTypeString}&searchview=1&maxRent=${maxPrice}&minSize=${minSize}&radius=${
      radius === "0" ? "1" : radius
    }
  `;
  // console.log(searchLink);
  return searchLink;
}
