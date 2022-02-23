$("button#meteo").click(function () {
  const ville = $("select#ville option:selected").val()
  myAjax({ ville })
})
$("button#meteo2").click(function () {
  const ville = $("input#ville2").val()
  myAjax({ ville })
})

function fetchCitiesList() {
  $.ajax({
    url: "listCities.php",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (data) {
      addOptionInDatalist(data)
    },
    error: function (data) {
      console.error(data)
    },
    complete: function (data) {
      console.log("Cities list complete ! 🍾")
    },
  })
}
console.time("execution")
fetchCitiesList()
$("#ville2").attr("list", "cityList")
$("#ville2").append(`
<datalist id="cityList"></datalist>
`)
function addOptionInDatalist(list) {
  $.each(list, function (key, value) {
    const { name } = value
    $("#cityList").append(`<option value="${name}"></option>`)
  })
}
console.timeEnd("execution")
function myAjax(city) {
  $.ajax({
    url: "meteoAjax-v2.php",
    type: "POST",
    dataType: "json",
    async: true,
    data: city,
    success: function (data) {
      if (!data.errors) {
        ajaxSuccess(data)
      } else {
        ajaxError(data)
      }
    },
    error: function (data) {
      ajaxError(data)
    },
    complete: function (data) {
      console.log("Mission complete ! 🍾")
    },
  })
}
function ajaxSuccess(data) {
  addTable(data)
}
function ajaxError(data) {
  displayError(data)
}
function addTable(data) {
  $("#madiv").html("")
  $("#madiv").append(`<h1>${data.city_info.name}</h1>`)
  $("#madiv").append(`<h2>${data.current_condition.date}</h2>`)
  $("#madiv").append(`
      <table id="prev_jours">
       <tr>
          <th>Jour</th>
          <th>Icône</th>
          <th>Cond.</th>
          <th>Tmin</th>
          <th>Tmax</th>
      </tr>
      <tbody>
      </tbdody>
    </table>
    `)
  $.each(data, function (key, value) {
    const reg = "^fcst_day_"
    if (key.match(reg)) {
      $("#prev_jours").append(`
      <tr>
        <td>${value.day_long}</td>
        <td><img src="${value.icon}" alt="image condition météo"></td>
        <td>${value.condition}</td>
        <td>${value.tmin}°C</td>
        <td>${value.tmax}°C</td>
      </tr>
      `)
    }
  })
  $("button#graph").click(function () {
    const tMinArray = []
    const tMaxArray = []
    const dayShortArray = []
    $.each(data, function (key, value) {
      const { tmin, tmax, day_short } = value
      const reg = "^fcst_day_"
      if (key.match(reg)) {
        tMinArray.push(tmin)
        tMaxArray.push(tmax)
        dayShortArray.push(day_short)
      }
    })

    const chart = Highcharts.chart("container", {
      chart: {
        type: "column",
      },
      title: {
        text: "Meteo",
      },
      yAxis: {
        title: {
          text: "Degré Celsius",
        },
      },
      xAxis: {
        categories: dayShortArray,
      },
      series: [
        {
          name: `${data.city_info.name}(Min)`,
          data: tMinArray,
        },
        {
          name: `${data.city_info.name}(Max)`,
          data: tMaxArray,
        },
      ],
    })
    chart.reflow()
  })
}
function displayError(data) {
  const { text, description } = data.errors[0]
  $("#madiv").html(``)
  $("#madiv").css({
    backgroundColor: "lightred",
    border: "3px solid red",
    borderRadius: "5px",
    textAlign: "center",
    padding: "10px",
  })
  $("#madiv").append(`<h1>❌ ${text} ❌</h1>`)
  $("#madiv").append(`<p>${description}</p>`)
}
