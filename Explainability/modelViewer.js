"use strict";
$(function() {
  let inputCsv = [
    {
     "visible_name": "Number of classes failed",
     "independent_variable": "failures",
     "value": -1.09352396
    },
    {
     "visible_name": "Free time after school is very high",
     "independent_variable": "C(freetime)[T.5]",
     "value": 0.94173611
    },
    {
     "visible_name": "Has extra educational support",
     "independent_variable": "C(schoolsup)[T.yes]",
     "value": -0.799469259
    },
    {
     "visible_name": "Father has Master's or higher",
     "independent_variable": "C(Fedu)[T.4]",
     "value": 0.677942385
    },
    {
     "visible_name": "Spends 5-10 hours studying each week",
     "independent_variable": "C(studytime)[T.3]",
     "value": 0.672544056
    },
    {
     "visible_name": "Free time after school is low",
     "independent_variable": "C(freetime)[T.2]",
     "value": 0.649371344
    },
    {
     "visible_name": "Wants to take higher education",
     "independent_variable": "C(higher)[T.yes]",
     "value": 0.616593102
    },
    {
     "visible_name": "Priority of going out with friends is low",
     "independent_variable": "C(goout)[T.2]",
     "value": 0.608793333
    },
    {
     "visible_name": "Quality of family relationships is bad",
     "independent_variable": "C(famrel)[T.2]",
     "value": 0.571555189
    },
    {
     "visible_name": "Weekday alcohol consumption is very high",
     "independent_variable": "C(Dalc)[T.5]",
     "value": 0.570318177
    },
    {
     "visible_name": "Weekday alcohol consumption is medium",
     "independent_variable": "C(Dalc)[T.3]",
     "value": -0.555407382
    },
    {
     "visible_name": "Weekend alcohol consuption is high",
     "independent_variable": "C(Walc)[T.4]",
     "value": -0.553899632
    },
    {
     "visible_name": "Chose this school for its reputation",
     "independent_variable": "C(reason)[T.reputation]",
     "value": 0.468820269
    },
    {
     "visible_name": "Travel time to school is high",
     "independent_variable": "C(traveltime)[T.4]",
     "value": -0.46634199
    },
    {
     "visible_name": "Student is male",
     "independent_variable": "C(sex)[T.M]",
     "value": 0.459210757
    },
    {
     "visible_name": "Attended nursery school",
     "independent_variable": "C(nursery)[T.yes]",
     "value": -0.445142438
    },
    {
     "visible_name": "Current health status is good",
     "independent_variable": "C(health)[T.4]",
     "value": -0.435694493
    },
    {
     "visible_name": "Chose this school for an \"other\" reason",
     "independent_variable": "C(reason)[T.other]",
     "value": 0.411442112
    },
    {
     "visible_name": "Travel time to school is low",
     "independent_variable": "C(traveltime)[T.2]",
     "value": -0.383841323
    },
    {
     "visible_name": "Current health status is medium",
     "independent_variable": "C(health)[T.3]",
     "value": -0.380068357
    },
    {
     "visible_name": "Current health status is bad",
     "independent_variable": "C(health)[T.2]",
     "value": -0.370362536
    },
    {
     "visible_name": "Intercept",
     "independent_variable": "Intercept",
     "value": 0.366298367
    },
    {
     "visible_name": "C(address)[T.U]",
     "independent_variable": "C(address)[T.U]",
     "value": 0.358119266
    },
    {
     "visible_name": "C(studytime)[T.4]",
     "independent_variable": "C(studytime)[T.4]",
     "value": 0.355366564
    },
    {
     "visible_name": "C(school)[T.MS]",
     "independent_variable": "C(school)[T.MS]",
     "value": -0.347945557
    },
    {
     "visible_name": "C(famsize)[T.LE3]",
     "independent_variable": "C(famsize)[T.LE3]",
     "value": 0.346143371
    },
    {
     "visible_name": "C(famsup)[T.yes]",
     "independent_variable": "C(famsup)[T.yes]",
     "value": -0.341545814
    },
    {
     "visible_name": "C(Pstatus)[T.T]",
     "independent_variable": "C(Pstatus)[T.T]",
     "value": -0.32859757
    },
    {
     "visible_name": "C(famrel)[T.4]",
     "independent_variable": "C(famrel)[T.4]",
     "value": -0.3235485
    },
    {
     "visible_name": "C(goout)[T.5]",
     "independent_variable": "C(goout)[T.5]",
     "value": -0.315513582
    },
    {
     "visible_name": "C(internet)[T.yes]",
     "independent_variable": "C(internet)[T.yes]",
     "value": 0.302962034
    },
    {
     "visible_name": "C(activities)[T.yes]",
     "independent_variable": "C(activities)[T.yes]",
     "value": -0.277689376
    },
    {
     "visible_name": "C(famrel)[T.3]",
     "independent_variable": "C(famrel)[T.3]",
     "value": -0.268788088
    },
    {
     "visible_name": "C(famrel)[T.5]",
     "independent_variable": "C(famrel)[T.5]",
     "value": -0.264011014
    },
    {
     "visible_name": "C(Fjob)[T.health]",
     "independent_variable": "C(Fjob)[T.health]",
     "value": -0.251325702
    },
    {
     "visible_name": "C(Medu)[T.1]",
     "independent_variable": "C(Medu)[T.1]",
     "value": -0.250038056
    },
    {
     "visible_name": "C(Dalc)[T.2]",
     "independent_variable": "C(Dalc)[T.2]",
     "value": -0.230930072
    },
    {
     "visible_name": "C(guardian)[T.other]",
     "independent_variable": "C(guardian)[T.other]",
     "value": 0.219360066
    },
    {
     "visible_name": "C(reason)[T.home]",
     "independent_variable": "C(reason)[T.home]",
     "value": 0.198586025
    },
    {
     "visible_name": "C(traveltime)[T.3]",
     "independent_variable": "C(traveltime)[T.3]",
     "value": 0.188412524
    },
    {
     "visible_name": "C(Walc)[T.5]",
     "independent_variable": "C(Walc)[T.5]",
     "value": -0.176073086
    },
    {
     "visible_name": "C(goout)[T.3]",
     "independent_variable": "C(goout)[T.3]",
     "value": 0.170652051
    },
    {
     "visible_name": "C(Fedu)[T.2]",
     "independent_variable": "C(Fedu)[T.2]",
     "value": 0.162340909
    },
    {
     "visible_name": "C(freetime)[T.4]",
     "independent_variable": "C(freetime)[T.4]",
     "value": 0.155835694
    },
    {
     "visible_name": "C(goout)[T.4]",
     "independent_variable": "C(goout)[T.4]",
     "value": -0.145095566
    },
    {
     "visible_name": "C(Fedu)[T.3]",
     "independent_variable": "C(Fedu)[T.3]",
     "value": -0.143917579
    },
    {
     "visible_name": "C(Fedu)[T.1]",
     "independent_variable": "C(Fedu)[T.1]",
     "value": -0.135684381
    },
    {
     "visible_name": "C(Fjob)[T.teacher]",
     "independent_variable": "C(Fjob)[T.teacher]",
     "value": 0.134761532
    },
    {
     "visible_name": "C(freetime)[T.3]",
     "independent_variable": "C(freetime)[T.3]",
     "value": -0.110584579
    },
    {
     "visible_name": "C(Fjob)[T.services]",
     "independent_variable": "C(Fjob)[T.services]",
     "value": 0.106175415
    },
    {
     "visible_name": "C(Medu)[T.2]",
     "independent_variable": "C(Medu)[T.2]",
     "value": 0.0721413
    },
    {
     "visible_name": "C(paid)[T.yes]",
     "independent_variable": "C(paid)[T.yes]",
     "value": -0.065787028
    },
    {
     "visible_name": "C(Walc)[T.3]",
     "independent_variable": "C(Walc)[T.3]",
     "value": -0.054622593
    },
    {
     "visible_name": "C(studytime)[T.2]",
     "independent_variable": "C(studytime)[T.2]",
     "value": 0.04377279
    },
    {
     "visible_name": "age",
     "independent_variable": "age",
     "value": -0.042378548
    },
    {
     "visible_name": "C(Fjob)[T.other]",
     "independent_variable": "C(Fjob)[T.other]",
     "value": -0.037715874
    },
    {
     "visible_name": "C(guardian)[T.mother]",
     "independent_variable": "C(guardian)[T.mother]",
     "value": 0.036934003
    },
    {
     "visible_name": "C(Medu)[T.4]",
     "independent_variable": "C(Medu)[T.4]",
     "value": 0.03280867
    },
    {
     "visible_name": "C(health)[T.5]",
     "independent_variable": "C(health)[T.5]",
     "value": -0.029616104
    },
    {
     "visible_name": "C(romantic)[T.yes]",
     "independent_variable": "C(romantic)[T.yes]",
     "value": 0.029554133
    },
    {
     "visible_name": "C(Dalc)[T.4]",
     "independent_variable": "C(Dalc)[T.4]",
     "value": -0.025903129
    },
    {
     "visible_name": "C(Walc)[T.2]",
     "independent_variable": "C(Walc)[T.2]",
     "value": 0.020764858
    },
    {
     "visible_name": "absences",
     "independent_variable": "absences",
     "value": -0.006100375
    },
    {
     "visible_name": "C(Medu)[T.3]",
     "independent_variable": "C(Medu)[T.3]",
     "value": 0.001833777
    }
    ];

  const positiveColor = "#75acff";
  const negativeColor = "#aa6bf9";
  // Set up rows in table
  let $tbody = $("tbody");
  for (let row of inputCsv) {
    let newRow = `<tr>
      <td>${row.visible_name}<button>...</button></td>
      <td><div style="width: ${100 * Math.abs(row.value)}px; height: 10px; background-color: ${row.value > 0 ? positiveColor:negativeColor};"></div></td>
      <td><button class="comment-button">Comments...</button><button>Balance Model</button><div class="popper"></div></td>
      <td><input value="${row.value}"></input></td>
      <td>0.0</td>
      </tr>`;
    $tbody.append(newRow);
  }

  // Set up bars to change on weight update
  $("input").on("change", function() {
    let bar = $(this).parent().prev().prev().children().first();
    let newValue = +$(this).val();
    if (newValue > 0) {
      bar.css('background-color', positiveColor);
      bar.width(100 * newValue);
    } else {
      bar.css('background-color', negativeColor);
      bar.width(-100 * newValue);
    }
  });

  // Set up comment popups
  $(".comment-button").each(function () {
    new Tooltip(this, {
      placement: 'bottom', // or bottom, left, right, and variations
      title: "Comments",
      trigger: 'click',
      template: `<div class="tooltip comment-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div><p>No comments yet</p>
      <form><input></input><button class="add-comment" disabled>Add comment</button></form></div>`
    });
  });

  // $(".add-comment").on("click", function(event) {
  //   event.preventDefault();
  //   $(this).prev().prev().text($(this).val());
  // });
});

function test()
{
  let inputCsv = [
    {
     "visible_name": "Number of classes failed",
     "independent_variable": "failures",
     "value": -1.09352396
    },
    {
     "visible_name": "Free time after school is very high",
     "independent_variable": "C(freetime)[T.5]",
     "value": 0.94173611
    },
    {
     "visible_name": "Has extra educational support",
     "independent_variable": "C(schoolsup)[T.yes]",
     "value": -0.799469259
    },
    {
     "visible_name": "Father has Master's or higher",
     "independent_variable": "C(Fedu)[T.4]",
     "value": 0.677942385
    },
    {
     "visible_name": "Spends 5-10 hours studying each week",
     "independent_variable": "C(studytime)[T.3]",
     "value": 0.672544056
    },
    {
     "visible_name": "Free time after school is low",
     "independent_variable": "C(freetime)[T.2]",
     "value": 0.649371344
    },
    {
     "visible_name": "Wants to take higher education",
     "independent_variable": "C(higher)[T.yes]",
     "value": 0.616593102
    },
    {
     "visible_name": "Priority of going out with friends is low",
     "independent_variable": "C(goout)[T.2]",
     "value": 0.608793333
    },
    {
     "visible_name": "Quality of family relationships is bad",
     "independent_variable": "C(famrel)[T.2]",
     "value": 0.571555189
    },
    {
     "visible_name": "Weekday alcohol consumption is very high",
     "independent_variable": "C(Dalc)[T.5]",
     "value": 0.570318177
    },
    {
     "visible_name": "Weekday alcohol consumption is medium",
     "independent_variable": "C(Dalc)[T.3]",
     "value": -0.555407382
    },
    {
     "visible_name": "Weekend alcohol consuption is high",
     "independent_variable": "C(Walc)[T.4]",
     "value": -0.553899632
    },
    {
     "visible_name": "Chose this school for its reputation",
     "independent_variable": "C(reason)[T.reputation]",
     "value": 0.468820269
    },
    {
     "visible_name": "Travel time to school is high",
     "independent_variable": "C(traveltime)[T.4]",
     "value": -0.46634199
    },
    {
     "visible_name": "Student is male",
     "independent_variable": "C(sex)[T.M]",
     "value": 0.459210757
    },
    {
     "visible_name": "Attended nursery school",
     "independent_variable": "C(nursery)[T.yes]",
     "value": -0.445142438
    },
    {
     "visible_name": "Current health status is good",
     "independent_variable": "C(health)[T.4]",
     "value": -0.435694493
    },
    {
     "visible_name": "Chose this school for an \"other\" reason",
     "independent_variable": "C(reason)[T.other]",
     "value": 0.411442112
    },
    {
     "visible_name": "Travel time to school is low",
     "independent_variable": "C(traveltime)[T.2]",
     "value": -0.383841323
    },
    {
     "visible_name": "Current health status is medium",
     "independent_variable": "C(health)[T.3]",
     "value": -0.380068357
    },
    {
     "visible_name": "Current health status is bad",
     "independent_variable": "C(health)[T.2]",
     "value": -0.370362536
    },
    {
     "visible_name": "Intercept",
     "independent_variable": "Intercept",
     "value": 0.366298367
    },
    {
     "visible_name": "C(address)[T.U]",
     "independent_variable": "C(address)[T.U]",
     "value": 0.358119266
    },
    {
     "visible_name": "C(studytime)[T.4]",
     "independent_variable": "C(studytime)[T.4]",
     "value": 0.355366564
    },
    {
     "visible_name": "C(school)[T.MS]",
     "independent_variable": "C(school)[T.MS]",
     "value": -0.347945557
    },
    {
     "visible_name": "C(famsize)[T.LE3]",
     "independent_variable": "C(famsize)[T.LE3]",
     "value": 0.346143371
    },
    {
     "visible_name": "C(famsup)[T.yes]",
     "independent_variable": "C(famsup)[T.yes]",
     "value": -0.341545814
    },
    {
     "visible_name": "C(Pstatus)[T.T]",
     "independent_variable": "C(Pstatus)[T.T]",
     "value": -0.32859757
    },
    {
     "visible_name": "C(famrel)[T.4]",
     "independent_variable": "C(famrel)[T.4]",
     "value": -0.3235485
    },
    {
     "visible_name": "C(goout)[T.5]",
     "independent_variable": "C(goout)[T.5]",
     "value": -0.315513582
    },
    {
     "visible_name": "C(internet)[T.yes]",
     "independent_variable": "C(internet)[T.yes]",
     "value": 0.302962034
    },
    {
     "visible_name": "C(activities)[T.yes]",
     "independent_variable": "C(activities)[T.yes]",
     "value": -0.277689376
    },
    {
     "visible_name": "C(famrel)[T.3]",
     "independent_variable": "C(famrel)[T.3]",
     "value": -0.268788088
    },
    {
     "visible_name": "C(famrel)[T.5]",
     "independent_variable": "C(famrel)[T.5]",
     "value": -0.264011014
    },
    {
     "visible_name": "C(Fjob)[T.health]",
     "independent_variable": "C(Fjob)[T.health]",
     "value": -0.251325702
    },
    {
     "visible_name": "C(Medu)[T.1]",
     "independent_variable": "C(Medu)[T.1]",
     "value": -0.250038056
    },
    {
     "visible_name": "C(Dalc)[T.2]",
     "independent_variable": "C(Dalc)[T.2]",
     "value": -0.230930072
    },
    {
     "visible_name": "C(guardian)[T.other]",
     "independent_variable": "C(guardian)[T.other]",
     "value": 0.219360066
    },
    {
     "visible_name": "C(reason)[T.home]",
     "independent_variable": "C(reason)[T.home]",
     "value": 0.198586025
    },
    {
     "visible_name": "C(traveltime)[T.3]",
     "independent_variable": "C(traveltime)[T.3]",
     "value": 0.188412524
    },
    {
     "visible_name": "C(Walc)[T.5]",
     "independent_variable": "C(Walc)[T.5]",
     "value": -0.176073086
    },
    {
     "visible_name": "C(goout)[T.3]",
     "independent_variable": "C(goout)[T.3]",
     "value": 0.170652051
    },
    {
     "visible_name": "C(Fedu)[T.2]",
     "independent_variable": "C(Fedu)[T.2]",
     "value": 0.162340909
    },
    {
     "visible_name": "C(freetime)[T.4]",
     "independent_variable": "C(freetime)[T.4]",
     "value": 0.155835694
    },
    {
     "visible_name": "C(goout)[T.4]",
     "independent_variable": "C(goout)[T.4]",
     "value": -0.145095566
    },
    {
     "visible_name": "C(Fedu)[T.3]",
     "independent_variable": "C(Fedu)[T.3]",
     "value": -0.143917579
    },
    {
     "visible_name": "C(Fedu)[T.1]",
     "independent_variable": "C(Fedu)[T.1]",
     "value": -0.135684381
    },
    {
     "visible_name": "C(Fjob)[T.teacher]",
     "independent_variable": "C(Fjob)[T.teacher]",
     "value": 0.134761532
    },
    {
     "visible_name": "C(freetime)[T.3]",
     "independent_variable": "C(freetime)[T.3]",
     "value": -0.110584579
    },
    {
     "visible_name": "C(Fjob)[T.services]",
     "independent_variable": "C(Fjob)[T.services]",
     "value": 0.106175415
    },
    {
     "visible_name": "C(Medu)[T.2]",
     "independent_variable": "C(Medu)[T.2]",
     "value": 0.0721413
    },
    {
     "visible_name": "C(paid)[T.yes]",
     "independent_variable": "C(paid)[T.yes]",
     "value": -0.065787028
    },
    {
     "visible_name": "C(Walc)[T.3]",
     "independent_variable": "C(Walc)[T.3]",
     "value": -0.054622593
    },
    {
     "visible_name": "C(studytime)[T.2]",
     "independent_variable": "C(studytime)[T.2]",
     "value": 0.04377279
    },
    {
     "visible_name": "age",
     "independent_variable": "age",
     "value": -0.042378548
    },
    {
     "visible_name": "C(Fjob)[T.other]",
     "independent_variable": "C(Fjob)[T.other]",
     "value": -0.037715874
    },
    {
     "visible_name": "C(guardian)[T.mother]",
     "independent_variable": "C(guardian)[T.mother]",
     "value": 0.036934003
    },
    {
     "visible_name": "C(Medu)[T.4]",
     "independent_variable": "C(Medu)[T.4]",
     "value": 0.03280867
    },
    {
     "visible_name": "C(health)[T.5]",
     "independent_variable": "C(health)[T.5]",
     "value": -0.029616104
    },
    {
     "visible_name": "C(romantic)[T.yes]",
     "independent_variable": "C(romantic)[T.yes]",
     "value": 0.029554133
    },
    {
     "visible_name": "C(Dalc)[T.4]",
     "independent_variable": "C(Dalc)[T.4]",
     "value": -0.025903129
    },
    {
     "visible_name": "C(Walc)[T.2]",
     "independent_variable": "C(Walc)[T.2]",
     "value": 0.020764858
    },
    {
     "visible_name": "absences",
     "independent_variable": "absences",
     "value": -0.006100375
    },
    {
     "visible_name": "C(Medu)[T.3]",
     "independent_variable": "C(Medu)[T.3]",
     "value": 0.001833777
    }
    ];

    var req = new XMLHttpRequest();
    req.open("POST", "http://localhost:8000/api/post/testmodel/");
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onload = function ()
    {
                // do something to response
        console.log(this.responseText);
    };
    req.send(JSON.stringify(inputCsv));
    console.log(req.responseText);
}