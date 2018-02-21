"use strict";
$(function() {
  let inputCsv = [
    {
     "independent_variable": "failures",
     "value": -1.09352396
    },
    {
     "independent_variable": "C(freetime)[T.5]",
     "value": 0.94173611
    },
    {
     "independent_variable": "C(schoolsup)[T.yes]",
     "value": -0.799469259
    },
    {
     "independent_variable": "C(Fedu)[T.4]",
     "value": 0.677942385
    },
    {
     "independent_variable": "C(studytime)[T.3]",
     "value": 0.672544056
    },
    {
     "independent_variable": "C(freetime)[T.2]",
     "value": 0.649371344
    },
    {
     "independent_variable": "C(higher)[T.yes]",
     "value": 0.616593102
    },
    {
     "independent_variable": "C(goout)[T.2]",
     "value": 0.608793333
    },
    {
     "independent_variable": "C(famrel)[T.2]",
     "value": 0.571555189
    },
    {
     "independent_variable": "C(Dalc)[T.5]",
     "value": 0.570318177
    },
    {
     "independent_variable": "C(Dalc)[T.3]",
     "value": -0.555407382
    },
    {
     "independent_variable": "C(Walc)[T.4]",
     "value": -0.553899632
    },
    {
     "independent_variable": "C(reason)[T.reputation]",
     "value": 0.468820269
    },
    {
     "independent_variable": "C(traveltime)[T.4]",
     "value": -0.46634199
    },
    {
     "independent_variable": "C(sex)[T.M]",
     "value": 0.459210757
    },
    {
     "independent_variable": "C(nursery)[T.yes]",
     "value": -0.445142438
    },
    {
     "independent_variable": "C(health)[T.4]",
     "value": -0.435694493
    },
    {
     "independent_variable": "C(reason)[T.other]",
     "value": 0.411442112
    },
    {
     "independent_variable": "C(traveltime)[T.2]",
     "value": -0.383841323
    },
    {
     "independent_variable": "C(health)[T.3]",
     "value": -0.380068357
    },
    {
     "independent_variable": "C(health)[T.2]",
     "value": -0.370362536
    },
    {
     "independent_variable": "Intercept",
     "value": 0.366298367
    },
    {
     "independent_variable": "C(address)[T.U]",
     "value": 0.358119266
    },
    {
     "independent_variable": "C(studytime)[T.4]",
     "value": 0.355366564
    },
    {
     "independent_variable": "C(school)[T.MS]",
     "value": -0.347945557
    },
    {
     "independent_variable": "C(famsize)[T.LE3]",
     "value": 0.346143371
    },
    {
     "independent_variable": "C(famsup)[T.yes]",
     "value": -0.341545814
    },
    {
     "independent_variable": "C(Pstatus)[T.T]",
     "value": -0.32859757
    },
    {
     "independent_variable": "C(famrel)[T.4]",
     "value": -0.3235485
    },
    {
     "independent_variable": "C(goout)[T.5]",
     "value": -0.315513582
    },
    {
     "independent_variable": "C(internet)[T.yes]",
     "value": 0.302962034
    },
    {
     "independent_variable": "C(activities)[T.yes]",
     "value": -0.277689376
    },
    {
     "independent_variable": "C(famrel)[T.3]",
     "value": -0.268788088
    },
    {
     "independent_variable": "C(famrel)[T.5]",
     "value": -0.264011014
    },
    {
     "independent_variable": "C(Fjob)[T.health]",
     "value": -0.251325702
    },
    {
     "independent_variable": "C(Medu)[T.1]",
     "value": -0.250038056
    },
    {
     "independent_variable": "C(Dalc)[T.2]",
     "value": -0.230930072
    },
    {
     "independent_variable": "C(guardian)[T.other]",
     "value": 0.219360066
    },
    {
     "independent_variable": "C(reason)[T.home]",
     "value": 0.198586025
    },
    {
     "independent_variable": "C(traveltime)[T.3]",
     "value": 0.188412524
    },
    {
     "independent_variable": "C(Walc)[T.5]",
     "value": -0.176073086
    },
    {
     "independent_variable": "C(goout)[T.3]",
     "value": 0.170652051
    },
    {
     "independent_variable": "C(Fedu)[T.2]",
     "value": 0.162340909
    },
    {
     "independent_variable": "C(freetime)[T.4]",
     "value": 0.155835694
    },
    {
     "independent_variable": "C(goout)[T.4]",
     "value": -0.145095566
    },
    {
     "independent_variable": "C(Fedu)[T.3]",
     "value": -0.143917579
    },
    {
     "independent_variable": "C(Fedu)[T.1]",
     "value": -0.135684381
    },
    {
     "independent_variable": "C(Fjob)[T.teacher]",
     "value": 0.134761532
    },
    {
     "independent_variable": "C(freetime)[T.3]",
     "value": -0.110584579
    },
    {
     "independent_variable": "C(Fjob)[T.services]",
     "value": 0.106175415
    },
    {
     "independent_variable": "C(Medu)[T.2]",
     "value": 0.0721413
    },
    {
     "independent_variable": "C(paid)[T.yes]",
     "value": -0.065787028
    },
    {
     "independent_variable": "C(Walc)[T.3]",
     "value": -0.054622593
    },
    {
     "independent_variable": "C(studytime)[T.2]",
     "value": 0.04377279
    },
    {
     "independent_variable": "age",
     "value": -0.042378548
    },
    {
     "independent_variable": "C(Fjob)[T.other]",
     "value": -0.037715874
    },
    {
     "independent_variable": "C(guardian)[T.mother]",
     "value": 0.036934003
    },
    {
     "independent_variable": "C(Medu)[T.4]",
     "value": 0.03280867
    },
    {
     "independent_variable": "C(health)[T.5]",
     "value": -0.029616104
    },
    {
     "independent_variable": "C(romantic)[T.yes]",
     "value": 0.029554133
    },
    {
     "independent_variable": "C(Dalc)[T.4]",
     "value": -0.025903129
    },
    {
     "independent_variable": "C(Walc)[T.2]",
     "value": 0.020764858
    },
    {
     "independent_variable": "absences",
     "value": -0.006100375
    },
    {
     "independent_variable": "C(Medu)[T.3]",
     "value": 0.001833777
    }
  ];

  var $tbody = $("tbody");
  for (let row of inputCsv) {
    var newRow = `<tr>
      <td>${row.independent_variable}<button>...</button></td>
      <td><div style="width: ${100 * Math.abs(row.value)}px; height: 10px; background-color: ${row.value > 0 ? "blue":"purple"};"></div></td>
      <td><button>Comments...</button><button>Balance Model</button></td>
      <td><input value="${row.value}"></input></td>
      <td>0.0</td>
      </tr>`;
    $tbody.append(newRow);
  }

  $("input").on("change", function() {
    let bar = $(this).parent().prev().prev().children().first();
    let newValue = +$(this).val();
    bar.width(100 * newValue);
    if (newValue > 0) {
      bar.css('background-color', "blue");
    } else {
      bar.css('background-color', "purple");
    }
  });
});
