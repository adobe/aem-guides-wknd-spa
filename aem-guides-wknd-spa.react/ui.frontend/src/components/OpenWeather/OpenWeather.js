import React from 'react';
import {MapTo} from '@adobe/aem-react-editable-components';
import ReactWeather, { useOpenWeather } from 'react-open-weather';

// Open weather API Key
const API_KEY = 'a930242f28d3c70ba3e1b51843c27c39';

// Logic to render placeholder or component
const OpenWeatherEditConfig = {

    emptyLabel: 'Weather',
    isEmpty: function(props) {
        return !props || !props.lat || !props.lon || !props.label;
    }
};

function ReactWeatherWrapper(props) {
    const { data, isLoading, errorMessage } = useOpenWeather({
        key: API_KEY,
        lat: props.lat,
        lon: props.lon,
        lang: 'en',
        unit: 'imperial', // values are (metric, standard, imperial)
    });

    return (
        <div className="cmp-open-weather">
            <ReactWeather
                isLoading={isLoading}
                errorMessage={errorMessage}
                data={data}
                lang="en"
                locationLabel={props.label}
                unitsLabels={{ temperature: 'F', windSpeed: 'mph' }}
                showForecast={false}
              />
        </div>
    );
}

export default function OpenWeather(props) {

        // render nothing if component not configured
        if(OpenWeatherEditConfig.isEmpty(props)) {
            return null;
        }

        // render ReactWeather component if component configured
        // pass in props
        return ReactWeatherWrapper(props);

}

// Map OpenWeather to AEM component
MapTo('wknd-spa-react/components/open-weather')(OpenWeather, OpenWeatherEditConfig);