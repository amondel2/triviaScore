$(document).ready(function () {
    $("#initsetup1").modal({
        keyboard: false,
        focus: true
    });
    $("#initsetup2").modal({
        keyboard: false,
        focus: false,
        show: false,
    });
    $('#quickSetup').prop('checked', false);

    $("#initsetup2").on('hidden.bs.modal', function(e) {
        if(teamNames.length === teams) {
            $("#initsetup2").modal('hide');
        } else {
            $("#initsetup2").modal('show');
        }
    });
    $("#initsetup1").on('hidden.bs.modal', function(e) {
        if(isNaN(parseInt(rounds) )|| isNaN(parseInt(teams))) {
            $("#initsetup1").modal('show');
        } else {
            $("#initsetup1").modal('hide');
        }
    });
    $("#initsetup1").modal('show');
    $("#AddTeam").on('click',addTeam);
    $("#liveSort").on('click',function () {
        if($("#liveSort").hasClass("btn-success")) {
            $("#liveSort").removeClass("btn-success");
            $("#liveSort").addClass("btn-danger");
            $("#liveSort").text("Turn Live Sorting On");
        } else {
            $("#liveSort").removeClass("btn-danger");
            $("#liveSort").addClass("btn-success");
            $("#liveSort").text("Turn Live Sorting Off");
        }
    });

    $("#manSortAndScore").on('click',function () {
        scoreTable();
        sortTable();
    });
});

var rounds, teams;
var teamNames = [];

$("#mdsetupContinueBtn1").on('click',function () {
    let messages = validateForm("#teamsetp1frm");
    if(messages.length === 0) {
        rounds = parseInt($("#round-numbers").val());
        teams = parseInt($("#team-number").val());
        $("#initsetup1").modal('hide');
        if($('#quickSetup').is(":checked")) {
            for(var i=1;i<=teams;i++) {
                teamNames.push("Team " + i);
            }
            createScoreTable();
        } else {
            initalizeTeams(1);
        }
    } else
        alert( messages + "Please Correct The Above Errors Before Continuing" );
});

$("#resetBtn").on('click',function () {
    window.location.reload();
})

$("#mdsetupContinueBtn2").on('click',function () {
    let messages = validateForm("#initsetup2frm");
    if(messages.length === 0) {
        teamNames.push($("#team-name").val());

        if(teamNames.length  < teams) {
            initalizeTeams(teamNames.length + 1);
        } else {
            $("#initsetup2").modal('hide');
            createScoreTable();
        }
    } else
        alert( messages + "Please Correct The Above Errors Before Continuing" );
});

function validateForm(frmName) {
    let messages = ""
    $.each($(frmName).find("input"), function (index,val) {
        if(!$(val)[0].checkValidity() ) {
            messages += $(val).parent().children("label").text() + " " + $(val)[0].validationMessage + "\r\n";
        }
    });
    return messages.trim()
}

function initalizeTeams(teamNumber) {
    $("#initsetup2teamnumber").text(teamNumber);
    $("#team-name").val("Team " + teamNumber);
    $("#initsetup2").modal('show');
}

const scoreAndSort = function () {
    scoreTable();
    if($("#liveSort").hasClass("btn-success"))
        sortTable();
};

const scoreTable = function() {
    for (let i = 0; i < teams; i++) {
        let id = "#teamRow" + i;
        let sum = 0;
        $.each($(id).children().find('input'), function (e, v) {
            let newNum = parseInt($(v).val());
            if (!isNaN(newNum))
                sum += newNum;
        });
        $(id).children().find('span').text(sum);
    }
};

function initLiveScore() {
    $( "#scoreTable tbody tr td input" ).off( "blur focusout");
    $( "#scoreTable tbody tr td input" ).on( "blur focusout",scoreAndSort );
}

function createScoreTable(){
    let teamScore = intialScoreTable();
    teamScore += initalTeamRows();
    $("#scoreTable").html(teamScore);
    initLiveScore();
    addUpdateEvents();
}

var addTeam = function() {
    $("#mdsetupContinueBtn2").off('click');
    $("#mdsetupContinueBtn2").on('click',function () {
        let messages = validateForm("#initsetup2frm");
        if(messages.length === 0) {
            teamNames.push($("#team-name").val());
            $("#scoreTbl tbody").append(initSingleTeamRow(teams));
            teams++;
            initLiveScore();
            $("#initsetup2").modal('hide');
        } else
            alert( messages + "Please Correct The Above Errors Before Continuing" );
    });
    initalizeTeams(teamNames.length + 1);
};

const intialScoreTable = function () {
    let tbl = "<table class=\"table table-striped table-bordered\" id='scoreTbl'><thead class=\"thead-dark\"><tr><th>Team Name</th>"
    for (let i = 1; i <= rounds; i++) {
        tbl += "<th>Round " + i + "</th>"
    }
    return tbl + "<th>Total Score</th></thead>"
};

function initalTeamRows(){
    let tbl = "<tbody>"
    for(let x = 0; x < teams; x++) {
        tbl += initSingleTeamRow(x);
    }
    return tbl + "</tbody></table>";
}


function addUpdateEvents() {
   $(document).on('click', 'table tr td:first-child',function(){
       var cnmame = $(this).text();
       $(this).html("<input type='text' value='"+ cnmame +"'>");
       $(this).children().first().focus();
    });
    $(document).on('blur focusout', 'table tr td:first-child', function(){
        var newName = $(this).children().val();
        if(newName && newName.length > 5) {
            $(this).html(newName);
        }
    });
}

function initSingleTeamRow(x) {
    let tbl = "";
    tbl += "<tr id='teamRow"+x+"'><td id='teamName" + x + "'>" + teamNames[x] + "</td>"
    for (let i = 1; i <= rounds; i++) {
        let id = "round" + i + "team" + x;
        tbl += "<td><input type='number' id='"+id+"' step=1 min='-10000' max='10000'></td>";
    }
    return tbl + "<td><span id='totalScore_"+x+"'></td></tr>";
}

function sortTable(){
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("scoreTbl");
    switching = true;
    let rowIndex = parseInt(rounds) + 1;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[rounds + 1];
            y = rows[i + 1].getElementsByTagName("TD")[rounds + 1];
            // Check if the two rows should switch place:
            if ( parseInt($(x).children('span').text()) < parseInt($(y).children('span').text()) ) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}