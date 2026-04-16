from flask import Flask , request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/")
def welcome():
    return "welcome user lets check your attendance"

@app.route ("/attendance", methods =["POST"])
def attendance():
    data = request.get_json()
    attended = data.get("attended")
    total = data.get("total")
    min_required = data.get("min_required" , 75)


    if attended is None or total is None:
        return jsonify({"error": "Please provide attended and total"}), 400
    if total == 0:
        return jsonify({"Error!" : "total classed can't be zero"}) , 400

    current_percentage = (attended/total) * 100

    response = {
        "current_percentage" : round(current_percentage, 2)
        }

    if current_percentage >= min_required:
        #can bunk classes
        bunk = 0
        while((attended / (total + bunk)) * 100 >= min_required ):
            bunk += 1
        response["status"] = "Safe"
        response["can_bunk"] = bunk - 1
    else:
        #need to attend classes
        attend = 0
        while(((attended + attend) / (total + attend )) * 100 < min_required):
            attend += 1
        response["status"] = "At Risk"
        response["must_attend"] = attend
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
