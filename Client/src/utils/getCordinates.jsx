import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: accessToken });

export const getCoordinates = async (address) => {
    try {
        const response = await geocodingClient.forwardGeocode({
        query: address,
        limit: 1,
        }).send();

        const match = response.body.features[0];
        if (match) {
            const { center } = match;
            const [longitude, latitude] = center;
            return { latitude, longitude };
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};
