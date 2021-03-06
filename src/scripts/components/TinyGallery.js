'use strict';

import React from 'react';
import { tns } from 'tiny-slider';

window.tns = tns;


function GalleryItem (props) {
    const { src, alt, index, onError } = props;
    return (
        <div className="Tiny-gallery-item">
            <img src={src} alt={alt} onError={() =>onError(index)}/>
        </div>
    );
}

function GalleryItemsList (props) {
    const { imgs, onError } = props;
    return imgs.map((img, index) => <GalleryItem key={index} index={index} src={img.src} alt={img.alt} onError={index => onError(index)}/>);
}

function NavItem (props) {
    return (
        <span></span>
    )
}

function NavItemList (props) {
    const { imgs } = props;

    return imgs.map((img, index) => <NavItem key={index} />)
}

function Controls (props) {
    return [
        <div className="Tiny-gallery-control prev" key="prev">
            <span> {'<'} </span>
        </div>,
        <div className="Tiny-gallery-control next" key="next">
            <span> {'>'} </span>
        </div>
    ]
}

class TinyGallery extends React.Component {
    constructor (props) {
        super(props);

        this.slider = null;
    }

    componentDidMount () {
        if (this.props.imgs.length) this.initSlider();
    }

    componentWillUnmount () {
        if (this.slider && this.slider.destroy) this.slider.destroy();
    }

    componentDidUpdate () {
        // this.slider.destroy && this.slider.destroy();
        this.slider.rebuild();
    }

    componentWillUpdate () {
        this.slider.destroy();
        console.log(this.slider);
    }

    initSlider () {
        console.log('slider initialize')
        const options = {
            container        : this.sliderContainer,
            navContainer     : this.navContainer,
            controlsContainer: this.controlsContainer
        };

        this.slider = tns(options);
        this.slider.events.on('indexChanged', () => this.fitNavContainer(this.slider.getInfo()))

    }

    fitNavContainer (info) {
        const visibleDotsCount = 5;
        const fixOnDot = Math.round(visibleDotsCount / 2);
        const dotStep  = 12;

        const { index, navContainer, slideCount } = info;
        const maxStepsOffset = slideCount - visibleDotsCount;
        
        let stepsOffset;
    
        if (index <= fixOnDot) {
            stepsOffset = 0;
        }
    
        if (index > fixOnDot) {
            stepsOffset = Math.min(index - fixOnDot, maxStepsOffset);
        }
    
        navContainer.style.transform = `translateX(${ -stepsOffset * dotStep }px)`;
    }

    render () {
        const { imgs, onImageError } = this.props;


        if (imgs.length) return (
            <div className="Tiny-gallery">
                <h1>{imgs.length}</h1>
                <div className="Tiny-gallery-wrapper">
                    <div
                        className="Tiny-gallery-container"
                        ref={node => this.sliderContainer = node}
                    >
                        <GalleryItemsList imgs={imgs} onError={index => onImageError(index)}/>
                    </div>

                    <div className="Tiny-gallery-controls"
                        ref={node => this.controlsContainer = node}
                    >
                        <Controls />
                    </div>

                    <div className="Tiny-gallery-nav">
                        <div className="Tiny-gallery-nav-track"
                            ref={node => this.navContainer = node}
                        >
                            <NavItemList imgs={imgs} />
                        </div>
                    </div>
                </div>
            </div>   
        );

        if (!imgs.length) return '';
    }
}

export default TinyGallery;