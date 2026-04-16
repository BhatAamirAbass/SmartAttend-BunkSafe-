async function calculate(){
    const attended = document.getElementById("attended").value;
    const total = document.getElementById("total").value;
    const min = document.getElementById("min").value;

    if (attended === "" || total === "") {
        alert("Please fill all fields");
        return;
    }

    try {
        console.log("STEP 1: Sending request...");
        

        const response = await fetch("http://localhost:5000/attendance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                attended: Number(attended),
                total: Number(total),
                min_required: min ? Number(min) : 75
            })
        });

        console.log("STEP 2: Response received", response);

        const data = await response.json();
        console.log("STEP 3: Data received", data);

        const resultDiv = document.getElementById("result");

        if (data.error) {
            resultDiv.innerHTML = `<p style="color:red">${data.error}</p>`;
            return;
        }

        if (data.status === "Safe"){
            resultDiv.innerHTML = `
                <p>Attendance: ${data.current_percentage}%</p>
                <p style="color: lightgreen">You are Safe ✅</p>
                <p>You can bunk ${data.can_bunk}</p>
            `;
        } else {
            resultDiv.innerHTML = `
                <p>Attendance: ${data.current_percentage}%</p>
                <p style="color: orange">You are At Risk ⚠️</p>
                <p>You must attend ${data.must_attend} classes consecutively</p>
            `;
        }

    } catch(error){
        console.log("❌ ERROR:", error);
        alert("Error: " + error);
    }
}