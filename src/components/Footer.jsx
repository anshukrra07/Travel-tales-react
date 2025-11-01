const Footer = () => {
  return (
    <>
      {/* Newsletter Section */}
      <section className="newsletter" id="contact">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2>Sign up to our newsletter</h2>
            <p>Receive latest news, update and many other things every week.</p>
          </div>
          <form action="#">
            <input type="email" name="email" placeholder="Enter your email...." required />
            <button type="submit" className="btn1">
              <i className="fa fa-telegram"></i>
            </button>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <section className="footer">
        <div className="footer-box">
          <a href="#" className="logo" style={{ fontSize: '20px' }}>
            Tra<span>vel</span> Ta<span>les</span>
          </a>
          <p>Enjoy the touring with TravelAround</p>
          <div className="social">
            <a href="#"><i className="fa fa-instagram"></i></a>
            <a href="#"><i className="fa fa-twitter"></i></a>
            <a href="#"><i className="fa fa-facebook"></i></a>
          </div>
        </div>
        <div className="footer-box">
          <h3>Company</h3>
          <a href="#">Travelling</a>
          <a href="#">About Location</a>
          <a href="#">Success</a>
          <a href="#">Information</a>
        </div>
        <div className="footer-box">
          <h3>Resources</h3>
          <a href="#">Download</a>
          <a href="#">Help Center</a>
          <a href="#">Guide Book</a>
          <a href="#">App Directory</a>
        </div>
        <div className="footer-box">
          <h3>Travellers</h3>
          <a href="#">Why Travellers</a>
          <a href="#">Customer Stories</a>
        </div>
      </section>

      {/* Copyright Section */}
      <div className="copyright">
        <p>
          Developed with ❤ Anshu Arya<br />
          © Copyright 2025 | Developed by Anshu arya | All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
