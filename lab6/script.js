window.onload = function () {
  var myChart = echarts.init(document.getElementById("main"));

  myChart.showLoading();

  Promise.all([
    fetch("./custom.geo.json").then((res) => res.json()),
    fetch("./dataset.json").then((res) => res.json()),
  ]).then(([customWorld, dataset]) => {
    echarts.registerMap("world", customWorld);

    // Dicionário para corrigir nomes divergentes entre dataset.json e GeoJSON
    // Dicionário para corrigir nomes divergentes entre dataset.json e GeoJSON
    const nameMapping = {
      USA: "United States of America",
      "United States": "United States of America",
      UK: "United Kingdom",
      Britain: "United Kingdom",
      Russia: "Russian Federation",
      "South Korea": "Korea, Republic of",
      "North Korea": "Korea, Democratic People's Republic of",
      Iran: "Iran, Islamic Republic of",
      Syria: "Syrian Arab Republic",
      Vietnam: "Viet Nam",
      Laos: "Lao People's Democratic Republic",
      "Ivory Coast": "Côte d'Ivoire",
      Bolivia: "Bolivia, Plurinational State of",
      Venezuela: "Venezuela, Bolivarian Republic of",
      Tanzania: "Tanzania, United Republic of",
      "Czech Republic": "Czechia",
      "Republic of Congo": "Congo",
      "Democratic Republic of Congo": "Congo, the Democratic Republic of the",
      Brunei: "Brunei Darussalam",
      Swaziland: "Eswatini",
      "Cape Verde": "Cabo Verde",
      Palestine: "Palestine, State of",
      Macedonia: "North Macedonia",
      Burma: "Myanmar",
      Moldova: "Moldova, Republic of",
      Egypt: "Egypt, Arab Republic of",
      Gambia: "Gambia, The",
      Bahamas: "Bahamas, The",
      Micronesia: "Micronesia, Federated States of",
      "St. Kitts and Nevis": "Saint Kitts and Nevis",
      "St. Lucia": "Saint Lucia",
      "St. Vincent and the Grenadines": "Saint Vincent and the Grenadines",
      Trinidad: "Trinidad and Tobago",
      Venezuela: "Venezuela",
      Bolivia: "Bolivia",
      "Democratic Republic Of The Congo": "Dem. Rep. Congo",
      "Central African Republic": "Central African Rep.",
      "South Sudan": "S. Sudan",
      Tanzania: "Tanzania",
      "Western Sahara": "W. Sahara",
      Russia: "Russia",
      Iran: "Iran",
      Egypt: "Egypt",
      Moldova: "Moldova",
      "Bosnia And Herzegovina": "Bosnia and Herz.",
      Laos: "Laos",
      Vietnam: "Vietnam",
      "North Korea": "North Korea",
      "South Korea": "South Korea",
      Gambia: "Gambia",
      "Dominican Republic": "Dominican Rep.",
    };

    function normalizeName(name) {
      return nameMapping[name] || name;
    }

    const year = "2025";

    const chartData = dataset["BAL"][year].map((item) => ({
      name: normalizeName(item.name),
      value: item.us_value / 1e9, // bilhões US$
    }));

    // Calcula min e max dinamicamente
    const values = chartData.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    myChart.hideLoading();

    const option = {
      title: {
        text: `Balança Comercial do Brasil (${year})`,
        subtext: "Dados do Monitor do Comércio Exterior Brasileiro",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          const millions = params.data?.value;
          if (millions === undefined) return `${params.name}: sem dados`;
          return `${params.name}: ${millions.toFixed(2)} bilhoes US$`;
        },
      },
      visualMap: {
        left: "right",
        min: minValue,
        max: maxValue,
        text: ["Mais exportações", "Mais importações"],
        inRange: { color: ["#d73027", "#ffffbf", "#1a9850"] },
        calculable: true,
      },
      series: [
        {
          name: "Balança Comercial",
          type: "map",
          map: "world",
          roam: true,
          emphasis: { label: { show: true } },
          data: chartData,
        },
      ],
    };

    myChart.setOption(option);
  });
};
