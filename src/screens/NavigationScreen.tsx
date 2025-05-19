import {Box, Container, Grid, styled, Typography} from "@mui/material";
import GemsImg from "../assets/gems.png"
import SwordsImg from "../assets/swords.png"
import {useNavigate} from "react-router-dom";

const PAGES = [
  {
    title: "Sword Calculator",
    image: SwordsImg,
    path: 'swords',
  },
  {
    title: "Gem Contribution",
    image: GemsImg,
    path: 'gems',
  },
]

const ImageContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  height: 256,
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover .image': {
    transform: 'scale(1.1)',
  },
  '&:hover .overlay': {
    opacity: 1,
  },
});

const BackgroundImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.4s ease',
});

const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

function NavigationScreen() {
  const navigation = useNavigate()

  return (
    <Container>
      <Typography
        component='h1'
        variant='h2'
        letterSpacing={3}
        noWrap
        sx={{ mb: 2, fontSize: 'clamp(3rem, 10vw, 4rem)', }}
      >
        ARISE TOOLS
      </Typography>

      <Grid container spacing={2} display={'flex'} justifyContent={'center'}>
        {PAGES.map(page => (
          <Grid
            size={'auto'} key={page.title}
            onClick={() => navigation(page.path)}
          >
            <ImageContainer sx={{ aspectRatio: 1 }}>
              <BackgroundImage src={page.image} alt={page.title} className="image" />
              <Overlay className="overlay">
                <Typography variant="h5" color="white">
                  {page.title}
                </Typography>
              </Overlay>
            </ImageContainer>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default NavigationScreen;