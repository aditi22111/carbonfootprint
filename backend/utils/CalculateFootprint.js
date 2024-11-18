// utils/CalculateFootprint.js
 const calculateFootprint = (formData) => {
    const { distanceToOffice, vehicleType, fuelType, energyUsage } = formData;
    
    // Example calculations (these values are just placeholders)
    let transportFootprint = 0;
    if (vehicleType === 'car') {
      transportFootprint = distanceToOffice * 0.25; // Placeholder value for kg CO2 per km
    }
  
    // Example for energy usage
    const energyFootprint = energyUsage * 0.5; // Placeholder value for kg CO2 per kWh
  
    // Total footprint calculation
    const totalFootprint = transportFootprint + energyFootprint;
  
    return {
      totalFootprint,
      transportFootprint,
      energyFootprint,
    };
  };
  