/**
 * This file contains functions for capturing user metadata
 * 
 * kward
 */
 export const metadata = {
    'ip': '',
    'city': '',
    'region': '',
    'country': '',
    'continent': '',
    'lat': '',
    'long': ''
};

// Get user metadata
export function getUserMetadata()
{
    // Get and store metadata
    metadata['ip'] = geoplugin_request();
    metadata['city'] = geoplugin_city();
    metadata['region'] = geoplugin_region();
    metadata['country'] = geoplugin_countryName();
    metadata['continent'] = geoplugin_continentCode();
    metadata['lat'] = geoplugin_latitude();
    metadata['long'] = geoplugin_longitude();

    return metadata;
}