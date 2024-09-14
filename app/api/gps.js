export async function POST(req) {
    try {
      const data = await req.json();
      const { lat, lng, deviceId } = data;  // Expecting the device's current location and ID
      // Handle the incoming GPS data (You can store it in a DB if needed)
      console.log(`Device ${deviceId} is at lat: ${lat}, lng: ${lng}`);
  
      return new Response(JSON.stringify({ message: 'Location received' }), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: 'Error receiving location' }), { status: 500 });
    }
  }
  