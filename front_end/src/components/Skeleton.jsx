// Skeleton.jsx – simple loading placeholder component
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const SkeletonBox = styled.div`
  width: 100%;
  height: 300px;
  background: #f0f0f0;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 10px;
`;

const Skeleton = () => {
    return <SkeletonBox data-testid="product-skeleton" />;
};

export default Skeleton;
