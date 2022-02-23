$("button#meteo").click(function () {
  const ville = $("select#ville option:selected").val()
  console.log(ville)
  console.log(`[${ville}]`)
  myAjax({ ville })
})
$("button#meteo2").click(function () {
  const ville = $("input#ville2").val()
  console.log(`[${ville}]`)
  myAjax({ ville })
})

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
      console.log("end")
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
  function createArray(arr, props) {
    const array = []
    $.each(arr, function (key, value) {
      const reg = "^fcst_day_"
      if (key.match(reg)) {
        array.push(value[props])
      }
    })
    return array
  }
  $("button#graph").click(function () {
    const minArray = createArray(data, "tmin")
    const maxArray = createArray(data, "tmax")
    const day = createArray(data, "day_short")

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
        categories: day,
      },
      series: [
        {
          name: `${data.city_info.name}(Min)`,
          data: minArray,
        },
        {
          name: `${data.city_info.name}(Max)`,
          data: maxArray,
        },
      ],
    })
    chart.reflow()
  })
}
function displayError(data) {
  $("#madiv").html(``)
  $("#madiv").css({
    backgroundColor: "red",
    borderRadius: "5px",
    textAlign: "center",
    padding: "10px",
  })
  $("#madiv").append(`<h1>${data.errors[0].text}</h1>`)
  $("#madiv").append(`<p>${data.errors[0].description}</p>`)
}
