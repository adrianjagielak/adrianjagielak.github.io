const runPlayer = (playerSelector = ".tvp-player3") => {
    const anthill = window.anthill;

    if (!anthill) {
        console.warn("Missing 'anthill' script");
        return;
    }

    const video = document.querySelector(playerSelector);

    if (!video) return;

    anthill.tvplayer3loader.loadPlayer(function (_error, _tvplayer3core) {
        if (_error) {
            console.error("Loading player3 error!");
            return;
        }

        const player = _tvplayer3core.createPlayer();

        const isAutoplay = Boolean(video.dataset.autoplay);

        player.init({
            container: playerSelector,
            videoID: video.dataset.id,
            seekToTime: 0,
            endPointData:
                "https://api.tvp.pl/shared/player2withoutTokenizer/api.dist.php?@method={{method}}&id={{id}}",
            endPointToken: "https://api.tvp.pl/tokenizer/token/{{id}}",
            gplayerAccountId: "AotLcG7O0IySPlFwVR9l8aRu.j06bC7gKvd07qoHXzf.67",
            gstreamAccountId: ".F4wq3hgS5eecNPg4Did0qdFPzfs128ifYRHR21h1Ij.r7",
            autoplay: isAutoplay,
            volumeLevel: 1,
            useDataLayer: true,
        });
    });
};

// Module Video

const moduleVideoItems = document.querySelectorAll(
    ".video-module .video-module__small"
);

if (moduleVideoItems.length > 0) {
    const playerSelector = ".video-module .tvp-player3";
    const moduleVideoContainer = document.querySelector(
        ".video-module #slider-video"
    );

    [...moduleVideoItems].forEach((item) => {
        item.addEventListener("click", () => {
            const itemVideoId = item.dataset.id;
            const currentVideoId = moduleVideoContainer.dataset.videoId;

            if (itemVideoId === currentVideoId) return;

            const moduleVideoPlayer = document.querySelector(playerSelector);

            moduleVideoPlayer.dataset.id = itemVideoId;
            moduleVideoContainer.dataset.videoId = itemVideoId;

            moduleVideoPlayer.classList.remove("tp3", "tp3-player-wrapper");
            runPlayer(playerSelector);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    runPlayer();

    const miniPlayerSelector = ".tvp-player3-mini";
    const miniPlayer = document.querySelector(miniPlayerSelector);

    if (miniPlayer) {
        runPlayer(miniPlayerSelector);
    }

    const moduleExtraSelector = ".tvp-player3-module-extra";
    const moduleExtraPlayer = document.querySelector(moduleExtraSelector);
    const moduleExtraPlayerStartButton = document.querySelector(
        "#js_short-article-player"
    );

    if (moduleExtraPlayerStartButton && moduleExtraPlayer) {
        moduleExtraPlayerStartButton.style.display = "block";

        moduleExtraPlayerStartButton.addEventListener("click", (event) => {
            event.preventDefault();
            runPlayer(moduleExtraSelector);
            moduleExtraPlayerStartButton.style.display = "none";
            moduleExtraPlayerStartButton.parentNode.querySelector(
                ".extra__photo--img"
            ).style.display = "none";
        });
    }
});
