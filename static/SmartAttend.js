async function calculate(){
    const attended = document.getElementById("attended").value;
    const total = document.getElementById("total").value;
    const min = document.getElementById("min").value;

    if (!attended || !total) {
    alert("Please fill all fields");
    return;
}
try{
    // const response = await fetch("http://127.0.0.1:5000/attendance", {method:"POST" ,
    //      headers : {
    //     "Content-Type" : "application/json"
    // },
    const response = await fetch("/attendance", {method:"POST" ,
         headers : {
        "Content-Type" : "application/json"
    },
    body : JSON.stringify({
        attended : Number(attended),
        total : Number(total),
        min_required: min ? Number(min) : 75
        })
    });

    const data = await response.json();

    const resultDiv = document.getElementById("result");
    
    if (data.error) {
        resultDiv.innerHTML = `<p style = "color: red"> ${data.error}</p>`;
        return;
    }
   let message = "";

if (data.status === "Safe") {
    if (data.can_bunk > 5) {
        message = "You’re basically on vacation mode 😎";
    } else if (data.can_bunk > 2) {
        message = "Careful… don’t get too confident 😏";
    } else {
        message = "One more bunk and you're in danger zone ⚠️";
    }

    resultDiv.innerHTML = `
        <p>Attendance: ${data.current_percentage}%</p>
        <p style="color: lightgreen">You are Safe ✅</p>
        <p>You can bunk ${data.can_bunk} classes</p>
        <p><b>${message}</b></p>
    `;

} else {
    if (data.must_attend > 100) {
        message = "Bro… Cancel your admission right now 😭";
    } else if (data.must_attend > 50) {
        message = "This is recoverable… but it's gonna hurt 💀";
    } else if (data.must_attend > 10) {
        message = "Time to stop bunking. Seriously.";
    } else {
        message = "You’re close… just focus for a few classes 💪";
    }

    resultDiv.innerHTML = `
        <p>Attendance: ${data.current_percentage}%</p>
        <p style="color: orange">You are At Risk ⚠️</p>
        <p>You must attend ${data.must_attend} classes</p>
        <p><b>${message}</b></p>
    `;
}
}
catch(error){
    alert("something went wrong, check console");

}

}