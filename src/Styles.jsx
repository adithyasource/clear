export function Styles(props) {
  return (
    <>
      <style jsx>{`
        #page {
          height: 100%;
          display: flex;
          gap: 30px;
          padding: 20px;
        }
        .foldersDiv {
          display: flex;
          flex-direction: row;
          gap: 20px;
          width: 100%;
          margin: 15px 0px 0px 0px;
        }
        .folderRack {
          margin: 0px 0px 40px 0px;
        }
        #gamesDiv {
          width: 80%;
          height: calc(100vh - 40px);
          overflow-y: scroll;
        }
        #sideBar {
          width: 20%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: calc(100vh - 40px);
        }
        dialog {
          border: none !important;
          background-color: #00000000;
          overflow: hidden;
          padding: 0px 50px 50px 0px;
          opacity: 0;
        }
        dialog[open] {
          animation: dialogFadeIn 0.3s ease normal;
          opacity: 1;
        }
        @keyframes dialogFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        dialog::backdrop {
          background-color: ${props.modalBackground()};
          opacity: 1;
          animation: dialogFadeIn 0.3s ease normal;
        }
        button,
        input {
          background-color: ${props.secondaryColor()};
          border: 0;
          padding: 10px;
          border-radius: ${props.borderRadius()};
        }
        #searchInput {
          width: 100%;
        }
        .standardButton {
          margin: 12px 0px 0px 0px;
          display: flex;
          justify-items: center;
          justify-content: space-between;
          width: min-content;
          gap: 5px;
          align-items: center;
        }
        #sideBarFolders {
          margin: 20px 0px 0px 0px;
        }
        .sideBarFolder {
          margin: 12px 0px 0px 0px;
          background: ${props.secondaryColor()};
          border-radius: ${props.borderRadius()};
          display: flex;
          justify-items: center;
          flex-direction: column;
          padding: 10px;
          gap: 15px;
          justify-content: space-between;
        }
        #sideBar {
          .standardButton {
            width: 100%;
          }
        }
        button,
        .gameCard {
          cursor: pointer;
        }
        .gameCard {
          background-color: #00000000;
          width: 15vw;
        }
        * {
          font-family: Helvetica;
          font-weight: normal;
          color: #ffffff;
          font-size: 14px;
          user-select: none;
          margin: 0;
          padding: 0;
          color-scheme: dark;
        }
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: ${props.primaryColor()};
        }
        /* Handle */
        ::-webkit-scrollbar-thumb {
          background: ${props.secondaryColor()};
          border-radius: 10px;
        }
        html,
        body {
          background-color: ${props.primaryColor()};
          height: 100%;
          margin: 0;
        }

        h1 {
          font-size: 25px;
          /* color: #ffffff80; */
          color: #a3a3a3;
        }
        #searchAndDestroy {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        .popupLogo {
          position: absolute;
        }
        .popUpDiv {
          display: flex;
          flex-direction: column;
          width: 100vw;
          height: 100vh;
          align-items: center;
          justify-content: center;
        }
        #newGame {
          flex-direction: row;
          position: relative;
          left: 195px;
        }
        .newGameLeft {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 7px;
        }
        .newGameLeft > button,
        .newGameRight > button {
          margin: 0px;
          padding: 0px;
        }
        .locatingHeroImg {
          background-color: #1c1c1c;
          width: 808px;
          height: 255px;
          overflow: hidden;
          padding: 0px;
          margin: 0px;
        }
        .centerHero {
          padding: 0px;
          margin: 0px;
        }
        .locatingLogoImg {
          position: relative;
          background-color: ${props.locatingLogoBackground()};
          width: 170px;
          height: 70px;
          right: 780px;
          bottom: -70px;
          padding: 0px;
          margin: 0px;
        }
        #locatedLogoImg {
          bottom: -100px;
        }

        .locatedLogoImgWithHero {
          position: relative;
          background-color: ${props.locatingLogoBackground()};
          width: 170px;
          height: 70px;
          right: 780px;
          padding: 0px;
          margin: 0px;
          bottom: 30px;
        }

        .noLocatedLogoImgWithHero {
          position: relative;
          background-color: ${props.locatingLogoBackground()};
          width: 170px;
          height: 70px;
          right: 780px;
          padding: 0px;
          margin: 0px;
          bottom: 50px;
        }

        img {
          object-fit: cover !important;
        }
        .locatingGridImg {
          position: relative;
          right: 420px;
          width: 225px;
          height: 340px;
          background: #272727;
          overflow: hidden;
          padding: 0px;
          margin: 0px;
        }
        .aboveHero {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 550px;
        }
        .aboveHeroRight {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .belowHero {
          display: flex;
          flex-direction: row;
          align-items: center;
          text-align: left;
          justify-content: space-between;
          width: 550px;
          gap: 10px;
        }
        .popUpMain {
          position: relative;
          .popUpRight {
            position: absolute;
            bottom: 30px;
            right: 30px;
            display: flex;
            gap: 15px;
          }
          .popupLogo {
            position: absolute;
            bottom: 30px;
            left: 30px;
          }
          .standardButton {
            width: max-content;
            backdrop-filter: blur(10px);
            background-color: ${props.secondaryColorForBlur()};
          }
        }

        .newGameLeft .functionalInteractables {
          backdrop-filter: blur(10px);
          background-color: ${props.secondaryColorForBlur()};
        }

        .heroBlur {
          filter: blur(80px);
          position: absolute;
          opacity: 0.4;
          z-index: -1;
        }

        .centerHero .heroBlur {
          left: 0px;
        }

        .popUpHero,
        .gridImage {
          border-radius: ${props.borderRadius()};
        }
        .gridImage {
          margin: 0px 0px 7px 0px;
        }
        .draggable {
          cursor: grab;
        }
        .folderGames {
          color: #ffffff80;
        }
        button:focus,
        input:focus {
          outline: 0;
        }
        .folderTitleBar {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .editButton {
          padding: 0;
        }
      `}</style>
    </>
  );
}
