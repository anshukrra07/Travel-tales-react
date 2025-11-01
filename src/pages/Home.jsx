import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { destinations, categories } from '../utils/data';

const Home = () => {
  const navigate = useNavigate();

  const openSearchBar = (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('search-bar');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth' });
      searchInput.focus();
    }
  };

  return (
    <>
      <Header />
      
      {/* Home Section */}
      <section className="home" id="home">
        <div className="home-content">
          <div className="home-text">
            <h5>Let's</h5>
            <h1>Discover the <br /> best lovely places</h1>
            <p>
              Plan and book your perfect trip with expert advice, travel <br /> tips, destination information and
              inspiration from us.
            </p>
            <a href="#" className="btn" id="book-trip-btn" onClick={openSearchBar}>
              Book a trip
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories" id="Category">
        <div className="home-text">
          <h1>Categories</h1>
          <p>
            Here are lots of interesting destinations to visit, but don't be confused - they're already grouped by
            Category.
          </p>
        </div>
        <div className="categories-content">
          {categories.map((cat, index) => (
            <div key={index} className="row" data-category={cat.name}>
              <Link
                to={`/search-results?query=${encodeURIComponent(cat.name)}`}
                className="category-link"
              >
                <div className="row-img">
                  <img src={cat.image} alt={cat.name} />
                </div>
                <h4>{cat.name}</h4>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-img">
          <img src="/images/about.png" alt="" />
        </div>
        <div className="about-text">
          <h5>Our Experience</h5>
          <h2>Our Stories Have Adventures</h2>
          <p>
            We are experienced in bringing adventures to stay their journey, with all outdoor destinations in the
            world as our specialities. Start your adventure now! Nature has already called you!
          </p>
          <div className="rating">
            <div className="col">
              <h4>12K+</h4>
              <p>Success Journey</p>
            </div>
            <div className="col">
              <h4>16+</h4>
              <p>Awards Winning</p>
            </div>
            <div className="col">
              <h4>20+</h4>
              <p>Years Of Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Section */}
      <section className="destination" id="destinations">
        <div className="center-text">
          <h2>Find Popular Destinations</h2>
        </div>
        <div className="destination-content">
          {destinations.map((dest, index) => (
            <div key={index} className="box">
              <Link
                to={`/nearby-place?destination=${encodeURIComponent(dest.name)}&name=${encodeURIComponent(
                  dest.name
                )}&image=${encodeURIComponent(dest.image)}&address=${encodeURIComponent(
                  dest.location
                )}&rating=${encodeURIComponent(dest.rating)}`}
              >
                <img src={dest.image} alt={dest.name} />
                <h4>{dest.name}</h4>
                <h6>{dest.location}</h6>
                <div className="row">
                  <p>
                    <b>⭐ {dest.rating}/5</b>
                  </p>
                  <span className="button view-details">
                    Visit
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Tour List Section */}
      <section className="tourlist" id="tour">
        <div className="tourlist-text">
          <h5>BEST TOURLISTs</h5>
          <h2>Amazing Tour Layouts</h2>
          <p>
            Show off all your tour and travel packages using the amazing tour list and tour single layouts in
            Voyage.You can choose from multiple looks for your tour list, including a great gallery layout and a
            modern boxes layout.
          </p>
          <a href="#" className="btn">
            View Tour Lists <i className="fa fa-rocket"></i>
          </a>
        </div>
        <div className="tourlist-img">
          <img src="/images/tourlist.png" alt="" />
        </div>
      </section>

      {/* Activity Section */}
      <section className="activity">
        <div className="center-text">
          <h2>Our Activities</h2>
        </div>
        <div className="activity-content">
          <div className="box">
            <img src="/images/camping.webp" alt="" />
            <h4>Camping</h4>
          </div>
          <div className="box">
            <img src="/images/hiking.webp" alt="" />
            <h4>Hiking</h4>
          </div>
          <div className="box">
            <img src="/images/climbing.webp" alt="" />
            <h4>Climbing</h4>
          </div>
          <div className="box">
            <img src="/images/paragliding.webp" alt="" />
            <h4>Paragliding</h4>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
