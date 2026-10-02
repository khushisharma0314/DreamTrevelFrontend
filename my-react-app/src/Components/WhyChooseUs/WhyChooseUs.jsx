import "./WhyChooseUs.css";

import why01 from "../../assets/why01.png";
import why02 from "../../assets/why02.png";
import why03 from "../../assets/why03.png";
import why04 from "../../assets/why04.png";
import supportImage from "../../assets/why-support-image.png";

function WhyChooseUs() {
  const features = [
    {
      image: why03,
      title: "Someone picks up, 24/7",
      desc: "Real support around the clock so last-minute changes do not stall your trip.",
    },
    {
      image: why02,
      title: "Fares you can actually use",
      desc: "Clear prices on flights and packages — no surprise add-ons at checkout.",
    },
    {
      image: why04,
      title: "Pay safe, fly sure",
      desc: "Protected payments and a booking flow built to keep every ticket secure.",
    },
    {
      image: why01,
      title: "Search to ticket, one flow",
      desc: "Pick a route, choose seats, and confirm — without jumping between sites.",
    },
  ];

  return (
    <section className="why-section">
      <div className="why-wrapper">

        {/* ================= HEADER ================= */}

        <div className="why-header">

          <h2 className="why-heading">
            What you get when you book here
          </h2>

          <div className="why-heading-line">
            <span className="line-dark"></span>
            <span className="line-orange"></span>
          </div>

          <p className="why-text">
            Fares, changes, and questions — handled in one place, by real people.
          </p>

        </div>


        {/* ================= BENEFITS ================= */}

        <div className="why-benefits">

          {/* ================= LEFT BIG CARD ================= */}

          <div className="why-main-card">

            <div className="why-card-number">
              01
            </div>

            <div className="why-main-content">

              {/* LEFT TEXT */}

              <div className="why-main-info">

                <div className="why-icon-box main-icon">
                  <img
                    src={features[0].image}
                    alt={features[0].title}
                  />
                </div>

                <h3>
                  {features[0].title}
                </h3>

                <p>
                  {features[0].desc}
                </p>

                <div className="why-check-list">

                  <div className="why-check-item">
                    <span>✓</span>
                    <p>Get help anytime</p>
                  </div>

                  <div className="why-check-item">
                    <span>✓</span>
                    <p>Speak to real people</p>
                  </div>

                  <div className="why-check-item">
                    <span>✓</span>
                    <p>Support for booking, changes & more</p>
                  </div>

                </div>

              </div>


              {/* RIGHT IMAGE */}

              <div className="why-main-visual">

                <div className="why-circle one"></div>

                <div className="why-circle two"></div>

                <img
                  src={supportImage}
                  alt="24/7 Travel Support"
                  className="why-support-image"
                />

              </div>

            </div>

          </div>


          {/* ================= RIGHT SIDE CARDS ================= */}

          <div className="why-side-cards">

            {features.slice(1).map((item, index) => {

              const actualIndex = index + 1;

              return (
                <div
                  className="why-side-card"
                  key={item.title}
                >

                  {/* NUMBER */}

                  <div className="why-side-number">
                    {String(actualIndex + 1).padStart(2, "0")}
                  </div>


                  {/* ICON */}

                  <div className="why-icon-box">
                    <img
                      src={item.image}
                      alt={item.title}
                    />
                  </div>


                  {/* CONTENT */}

                  <div className="why-side-content">

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.desc}
                    </p>

                  </div>


                  {/* ARROW */}

                  <div className="why-arrow">
                    →
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;