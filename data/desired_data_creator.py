# MAKE SURE TO CD INTO THIS FOLDER AND HAS PANDAS INSTALLED!!!!

# run this before deploying to compile all the given datasets  
# into one that only contains information used in the graph
# so lower end devices don't lag

# from national_health_data.csv
# join key cnty_fips
# percent_inactive,percent_smoking,urban_rural_status,elderly_percentage,number_of_hospitals,number_of_primary_care_physicians,percent_no_heath_insurance,percent_high_blood_pressure,percent_coronary_heart_disease,percent_stroke,percent_high_cholesterol
# overall health

# from Rural_Atlas_Update24/Veterans.csv
# join key FIPS
# values NonVetsDisabilty, VetsDisabilty in Attribute col
# veteran status among the disabled

# How disabled status effects veterans and non veteran's health
import pandas as pd

# veterans csv is stinky
def force_utf8_conversion(file_path):
    # First read with latin1 (won't throw errors)
    df = pd.read_csv(file_path, encoding='latin1')
    
    # Convert problematic columns to UTF-8
    for col in df.select_dtypes(include=['object']):
        df[col] = df[col].str.encode('latin1').str.decode('utf-8', errors='replace')
    
    return df

# Read the CSV files
health_df = pd.read_csv('national_health_data_2024.csv')
veterans_df = force_utf8_conversion('Rural_Atlas_Update24/Veterans.csv')

# Select specific columns from health data
health_columns = [
    'cnty_fips',
    'percent_inactive', 
    'percent_smoking',
    'percent_high_blood_pressure',
    'percent_coronary_heart_disease',
    'percent_stroke',
    'percent_high_cholesterol'
]

# Filter veterans data for the specific attribute values
non_vets_mask = veterans_df['Attribute'] == 'NonVetsDisabilty'
vets_mask = veterans_df['Attribute'] == 'VetsDisabilty'

# Create separate DataFrames for each attribute value
non_vets_df = veterans_df[non_vets_mask][['FIPS', 'Value']]
vets_df = veterans_df[vets_mask][['FIPS', 'Value']]

# Rename Attribute column to match previous naming convention
non_vets_df = non_vets_df.rename(columns={'Value': 'NonVetsDisabilty'})
vets_df = vets_df.rename(columns={'Value': 'VetsDisabilty'})

# Select health data columns
health_subset = health_df[health_columns]

# Perform sequential merges
merged_data = pd.merge(
    health_subset,
    non_vets_df,
    left_on='cnty_fips',
    right_on='FIPS',
    how='inner'
)

final_data = pd.merge(
    merged_data,
    vets_df,
    left_on='cnty_fips',
    right_on='FIPS',
    how='inner'
)

# Display the final merged data
print(final_data.head())

# export data as file
final_data.to_csv('desired_data.csv', index=False, encoding='utf-8')