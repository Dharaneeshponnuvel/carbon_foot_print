import json
import matplotlib.pyplot as plt
import numpy as np

# User input (same as you provided)
user_input = {
    "Body Type": "overweight",
    "Sex": "male",
    "Diet": "omnivore",
    "How Often Shower": "more frequently",
    "Heating Energy Source": "coal",
    "Transport": "private",
    "Vehicle Type": "petrol",
    "Social Activity": "often",
    "Monthly Grocery Bill": 400,  # High grocery bill
    "Frequency of Traveling by Air": "very frequently",  # Very high air travel
    "Vehicle Monthly Distance Km": 1500,  # High car usage
    "Waste Bag Size": "large",
    "Waste Bag Weekly Count": 5,
    "How Long TV PC Daily Hour": 10,
    "How Many New Clothes Monthly": 40,
    "How Long Internet Daily Hour": 0.5,  # Low internet usage
    "Energy efficiency": "No",
}


default_emission_factors = {
    "Shower": 0.6,
    "Vehicle (petrol)": 0.21,
    "Vehicle (diesel)": 0.18,
    "Vehicle (lpg)": 0.09,
    "Vehicle (hybrid)": 0.05,
    "Vehicle (electric)": 0.02,
    "Public Transport": 0.05,
    "Transport (bike)": -1,
    "Air Travel": 1.0,
    "Social Activity": 1.0,
    "Grocery Bill": 1.0,
    "Waste Disposal": 1.5,
    "TV/PC Usage": 0.6,
    "Internet Usage": 0.2,
    "Clothes Purchased": 25,
    "Recycling (Metal)": -20,
    "Recycling (Plastic)": -18,
    "Recycling (Paper)": -15,
    "Recycling (Glass)": -12,
    "Cooking (Oven)": 1.2,
    "Cooking (Stove)": 0.8,
    "Cooking (Microwave)": 0.6,
    "Cooking (Grill)": 1.0,
    "Cooking (Airfryer)": 0.5
}

# Calculate activity mapping
activity_mapping = {}

activity_mapping["Shower"] = (
    900 if user_input["How Often Shower"] == "twice a day" else
    450 if user_input["How Often Shower"] == "more frequently" else
    300 if user_input["How Often Shower"] == "daily" else
    150
)



if user_input["Transport"] == "private" and user_input["Vehicle Type"]:
    vehicle_type = user_input["Vehicle Type"]
    distance = user_input["Vehicle Monthly Distance Km"]
    activity_mapping[f"Vehicle ({vehicle_type})"] = distance

if user_input["Transport"] == "public":
    activity_mapping["Public Transport"] = user_input["Vehicle Monthly Distance Km"]

if user_input["Transport"] == "walk/bicycle":
    activity_mapping["Transport (bike)"] = 100  # offset as positive to apply negative factor

activity_mapping["Air Travel"] = (
    400 if user_input["Frequency of Traveling by Air"] == "very frequently" else
    250 if user_input["Frequency of Traveling by Air"] == "frequently" else
    100 if user_input["Frequency of Traveling by Air"] == "rarely" else
    0
)

activity_mapping["Social Activity"] = (
    150 if user_input["Social Activity"] == "often" else
    75 if user_input["Social Activity"] == "sometimes" else
    20
)

activity_mapping["Grocery Bill"] = user_input["Monthly Grocery Bill"]
activity_mapping["Waste Disposal"] = user_input["Waste Bag Weekly Count"] * 4
activity_mapping["TV/PC Usage"] = user_input["How Long TV PC Daily Hour"] * 30
activity_mapping["Internet Usage"] = user_input["How Long Internet Daily Hour"] * 30
activity_mapping["Clothes Purchased"] = user_input["How Many New Clothes Monthly"]

 

# Compute emissions
emissions = {}
for activity, units in activity_mapping.items():
    factor = default_emission_factors.get(activity, default_emission_factors.get(activity.split()[0], 1))
    emissions[activity] = round(units * factor, 2)

# Normalize emissions for severity
values = list(emissions.values())
sorted_vals = sorted(values)
q1 = sorted_vals[int(len(sorted_vals) * 0.25)]
q2 = sorted_vals[int(len(sorted_vals) * 0.5)]
q3 = sorted_vals[int(len(sorted_vals) * 0.75)]

severity_map = {
    "Critical": lambda x: x >= q3,
    "High": lambda x: q2 <= x < q3,
    "Moderate": lambda x: q1 <= x < q2,
    "Low": lambda x: x < q1
}

def classify(value):
    for level, condition in severity_map.items():
        if condition(value):
            return level
    return "Low"

recommendations = {
    "Air Travel": "Reduce flights or offset carbon emissions",
    "Clothes Purchased": "Buy second-hand or fewer clothes",
    "Recycling (Metal)": "Great job recycling metal!",
    "Transport (bike)": "Great! Keep using bike as transport"
}

def get_message(activity, severity):
    # Base message from recommendations dict or severity level
    base_msg = recommendations.get(activity, {
        "Critical": "Severe carbon impact. Consider urgent changes.",
        "High": "High impact. Try to reduce or improve.",
        "Moderate": "Moderate impact. Small improvements help.",
        "Low": "Low carbon impact. Good work!"
    }[severity])

    # Smart recommendation matching (context-aware)
    if activity == "Air Travel" and severity in ("Critical", "High"):
        internet_usage = emissions.get("Internet Usage", 0)
        if internet_usage < 10:
            return base_msg + " Also consider replacing some meetings with video calls."
    if activity == "Recycling (Metal)" and severity == "Low":
        grocery_bill = activity_mapping.get("Grocery Bill", 0)
        if grocery_bill > 200 and "Metal" not in user_input["Recycling"]:
            return "Consider recycling cans to reduce metal waste."
    return base_msg

output = []
for activity, value in emissions.items():
    severity = classify(value)
    message = get_message(activity, severity)
    output.append({
        "Activity": activity,
        "Emission (kg CO₂e)": value,
        "Severity": severity,
        "Message": message
    })

sorted_output = sorted(output, key=lambda x: x["Emission (kg CO₂e)"], reverse=True)

final_json_output = {
    "Top 2 Carbon-Intensive Activities": sorted_output[:2],
    "Least Emitting Activities": sorted_output[-2:]
}

print(json.dumps(final_json_output, indent=2))

# === Visual Feedback ===
# Create a bar chart of all emissions for visualization

activities = list(emissions.keys())
values = [emissions[a] for a in activities]

plt.figure(figsize=(12, 6))
bars = plt.barh(activities, values, color='skyblue')
plt.xlabel('Emission (kg CO₂e)')
plt.title('Carbon Emissions per Activity')

# Highlight top 2 carbon-intensive activities in red
top_activities = {item['Activity'] for item in sorted_output[:2]}
for bar, activity in zip(bars, activities):
    if activity in top_activities:
        bar.set_color('salmon')

plt.gca().invert_yaxis()  # Highest on top
plt.tight_layout()
plt.show()