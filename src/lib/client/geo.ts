"use client";

export async function getUserCurrentPostion() {
  return new Promise<GeolocationCoordinates>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve(coords);
      },
      (error) => {
        reject(error);
      }
    );
  });
}
