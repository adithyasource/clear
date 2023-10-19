export function Styles(props) {
  return (
    <>
      <style jsx>{`
        #page {
          height: 100%;
          display: flex;
          gap: 30px;
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
          width: 100%;
        }
        #sideBar {
          width: 20%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100vh;
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
          margin: 10px;
        }
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

        .toolbarRight {
          display: flex;
          gap: 10px;
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

        .centerHero {
          padding: 0px;
          margin: 0px;
        }

        img {
          object-fit: cover !important;
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
            bottom: 20px;
            left: 30px;
          }
          .standardButton {
            width: max-content;
          }
        }

        .functionalInteractables,
        .standardButton {
          backdrop-filter: blur(10px) !important;
          background-color: ${props.secondaryColorForBlur()} !important;
        }

        .centerHero .heroBlur {
          left: 0px;
        }

        .popUpHero,
        .gridImage {
          border-radius: ${props.borderRadius()};
        }

        .popUpHero {
          height: 254px;
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

        .locatingLogoImg {
          background-color: #272727;
        }
        .locatedHeroImg {
          background-color: #27272700;
        }

        .mainNewGame {
          display: flex;
          gap: 10px;
        }

        .newGameDiv {
          display: flex;
          flex-direction: column;
          width: 100vw;
          height: 100vh;
          align-items: center;
          justify-content: center;
        }

        .tooltip {
          background: #272727cc;
          backdrop-filter: blur(10px);
          border: 0.5px solid #ffffff10;

          color: #fff;
          padding: 8px 10px;
          font-family: Helvetica;
          line-height: 12px;
          white-space: nowrap;
          border-radius: 6px;
        }
      `}</style>
    </>
  );
}
