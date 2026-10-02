import "./Destinations.css";

import losAngeles from "../../assets/los-angeles-flight.jpg";
import newYork from "../../assets/new-york-flight.jpg";
import toronto from "../../assets/toronto-flight.jpg";
import chicago from "../../assets/chicago-flight.jpg";
import germany from "../../assets/germany.png";

function Destinations() {
    const destinations = [
        {
            image: losAngeles,
            name: "Los Angeles",
        },
        {
            image: newYork,
            name: "New York",
        },
        {
            image: toronto,
            name: "Toronto",
        },
        {
            image: chicago,
            name: "Chicago",
        },
        {
            image: germany,
            name: "Germany",
        },
    ];

    return (
        <section className="destination-section">
            <div className="destination-container">

                <h2 className="destination-heading">
                    Where Your Dream Journey Begins
                </h2>

                <div className="destination-grid">

                    {destinations.map((destination, index) => (
                        <div
                            className="destination-card"
                            key={index}
                        >

                            <img
                                src={destination.image}
                                alt={destination.name}
                                className="destination-image"
                            />

                            <div className="destination-overlay"></div>

                            <h3 className="destination-name">
                                {destination.name}
                            </h3>

                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}

export default Destinations;