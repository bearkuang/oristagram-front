import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
`;

const MainContainer = styled.div`
  color: #484848;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #FF5A5F;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a`
  color: #484848;
  text-decoration: none;
  &:hover {
    color: #FF5A5F;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Section = styled.section<{ bgImage: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  &.visible {
    animation: ${fadeIn} 1s forwards;
  }
`;

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
  color: #FFFFFF;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
`;

const Subtitle = styled.p`
  font-size: 24px;
  margin-bottom: 30px;
  color: #FFFFFF;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
`;

const CTAButton = styled.button`
  background-color: #FF5A5F;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background-color: #E5484D;
    transform: scale(1.05);
  }
`;

interface SectionData {
    id: string;
    bgImage: string;
    title: string;
    subtitle: string;
}

const sections: SectionData[] = [
    {
        id: 'friends',
        bgImage: '/image/friends.jpg',
        title: 'Connect with Friends',
        subtitle: 'Share your moments with those who matter most'
    },
    {
        id: 'food',
        bgImage: '/image/food.jpg',
        title: 'Capture Delicious Moments',
        subtitle: 'Show off your culinary adventures'
    },
    {
        id: 'flowers',
        bgImage: '/image/flowers.jpg',
        title: 'Explore Beautiful Places',
        subtitle: 'Discover and share breathtaking locations'
    },
    {
        id: 'camera',
        bgImage: '/image/camera.jpg',
        title: 'Instant Memories',
        subtitle: 'Create and relive your favorite moments'
    },
    {
        id: 'likes',
        bgImage: '/image/likes.jpg',
        title: 'Engage with Your Community',
        subtitle: 'Like, comment, and connect with others'
    }
];

const MainPage: React.FC = () => {
    const [visibleSections, setVisibleSections] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/login");
    }

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sections.forEach(section => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => [...prev, section.id]);
                    } else {
                        setVisibleSections(prev => prev.filter(id => id !== section.id));
                    }
                });
            }, { threshold: 0.5 });

            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
            observers.push(observer);
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, []);

    return (
        <>
            <GlobalStyle />
            <MainContainer>
                <Navbar>
                    <Logo>Origram</Logo>
                </Navbar>

                {sections.map(section => (
                    <Section
                        key={section.id}
                        id={section.id}
                        bgImage={section.bgImage}
                        className={visibleSections.includes(section.id) ? 'visible' : ''}
                    >
                        <Title>{section.title}</Title>
                        <Subtitle>{section.subtitle}</Subtitle>
                        <CTAButton onClick={handleClick}>Let's log in</CTAButton>
                    </Section>
                ))}
            </MainContainer>
        </>
    );
};

export default MainPage;