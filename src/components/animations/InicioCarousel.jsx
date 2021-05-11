import React from "react";
import Carousel from "react-bootstrap/Carousel";
import imagen1 from "../../images/inicioCarousel/pexels-aleksandar-pasaric-2341282.jpg";
import imagen2 from "../../images/inicioCarousel/pexels-gabriel-klein-2119163.jpg";
import imagen3 from "../../images/inicioCarousel/pexels-lê-minh-977213.jpg";
import imagen4 from "../../images/inicioCarousel/pexels-pixabay-210182.jpg";

function InicioCarousel() {
  
  return (
    <div className="containerCarousel">
      <Carousel fade pause={false} >
        <Carousel.Item interval={3000} className="vh-100">
          <img
            className="d-block w-100 "
            src={imagen1}
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={3000} className="vh-100">
          <img
            className="d-block w-100"
            src={imagen2}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={3000} className="vh-100">
          <img
            className="d-block w-100" 
            src={imagen3}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={3000} className="vh-100">
          <img
            className="d-block w-100"
            src={imagen4}
            alt="Fourth slide"
          />
          <Carousel.Caption>
            <h3>Fourth slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default InicioCarousel;
