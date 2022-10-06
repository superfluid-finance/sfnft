// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    // get arguments
    const sender = event.queryStringParameters.sender;
    const receiver = event.queryStringParameters.receiver;
    // TODO: add tokenAddr, startDate, flowrate
  
    // derive needed values
    const startDateStr = "2022/10/22"; // placeholder
    const flowratePerMonth = 4269; // placeholder
    const tokenSymbol = "DAIx"; // placeholder
    const senderAbbr = `${sender.substr(0,6)}…${sender.substr(sender.length-4,sender.length)}`;
    const receiverAbbr = `${receiver.substr(0,6)}…${receiver.substr(receiver.length-4,receiver.length)}`;
  
    const retStr = `
    <svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700" fill="none">
        <g clip-path="url(#clip0_1906_250620)">
            <rect width="700" height="700" fill="#101010"/>
            <g filter="url(#filter0_f_1906_250620)">
                <circle cx="109.715" cy="536.641" r="300" fill="url(#paint0_radial_1906_250620)"/>
            </g>
            <g filter="url(#filter1_f_1906_250620)">
                <circle cx="560.383" cy="227.505" r="300" fill="url(#paint1_radial_1906_250620)"/>
            </g>
            <g style="mix-blend-mode:overlay">
                <rect y="505.67" width="8.92743" height="71.7016" transform="rotate(-90 0 505.67)" fill="white" fill-opacity="0.25"/>
                <rect x="179.249" y="496.742" width="4.1835" height="519.719" transform="rotate(-90 179.249 496.742)" fill="white" fill-opacity="0.25"/>
                <rect x="365.637" y="490.254" width="11.156" height="333.341" transform="rotate(-90 365.637 490.254)" fill="white" fill-opacity="0.25"/>
                <rect x="399.067" y="476.794" width="4.1835" height="299.914" transform="rotate(-90 399.067 476.794)" fill="white"/>
                <rect x="468.833" y="513.89" width="8.36699" height="230.151" transform="rotate(-90 468.833 513.89)" fill="white"/>
                <rect y="505.758" width="4.1835" height="254.467" transform="rotate(-90 0 505.758)" fill="white"/>
                <rect x="620.529" y="457.636" width="8.36699" height="78.4715" transform="rotate(-90 620.529 457.636)" fill="white"/>
                <rect y="467.866" width="8.36699" height="128.671" transform="rotate(-90 0 467.866)" fill="white" fill-opacity="0.25"/>
                <rect x="388.167" y="511.788" width="4.1835" height="80.6631" transform="rotate(-90 388.167 511.788)" fill="white" fill-opacity="0.25"/>
                <rect y="465.774" width="4.1835" height="568.673" transform="rotate(-90 0 465.774)" fill="white"/>
                <rect y="442.145" width="8.29073" height="568.673" transform="rotate(-90 0 442.145)" fill="white" fill-opacity="0.25"/>
            </g>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M292.827 612.891H286.309V606.382H279.79V599.873H292.827V612.891ZM273.272 619.4H279.79V612.891H273.272V619.4ZM265.186 595.698V623.575C265.186 625.729 266.934 627.474 269.091 627.474H297.008C299.164 627.474 300.912 625.729 300.912 623.575V595.698C300.912 593.545 299.164 591.799 297.008 591.799H269.091C266.934 591.799 265.186 593.545 265.186 595.698V595.698Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M393.946 617.813H397.745V596.402H393.946V617.813ZM392.132 596.402V599.802H391.217C390.336 599.802 389.693 599.971 389.29 600.308C388.886 600.644 388.685 601.197 388.685 601.965V603.904H392.132V607.107H388.685V617.813H384.886V601.628C384.886 599.905 385.355 598.603 386.293 597.723C387.231 596.843 388.553 596.402 390.26 596.402H392.132ZM362.949 609.468H369.28C369.261 608.626 368.965 607.947 368.393 607.432C367.821 606.917 367.113 606.659 366.269 606.659C365.462 606.659 364.759 606.912 364.158 607.418C363.558 607.923 363.155 608.607 362.949 609.468ZM372.712 612.138H362.949C363.174 613.019 363.628 613.698 364.313 614.175C364.997 614.653 365.847 614.892 366.86 614.892C368.229 614.892 369.523 614.423 370.743 613.486L372.318 616.072C370.649 617.458 368.792 618.151 366.747 618.151C364.608 618.188 362.794 617.49 361.302 616.058C359.811 614.624 359.084 612.896 359.122 610.874C359.084 608.869 359.787 607.146 361.232 605.704C362.676 604.261 364.402 603.559 366.41 603.596C368.323 603.596 369.894 604.214 371.122 605.451C372.351 606.687 372.966 608.223 372.966 610.059C372.966 610.733 372.881 611.427 372.712 612.138ZM352.877 608.092C353.552 608.805 353.89 609.732 353.89 610.874C353.89 611.998 353.548 612.916 352.863 613.628C352.178 614.34 351.32 614.696 350.288 614.696C349.275 614.696 348.435 614.354 347.77 613.669C347.104 612.986 346.771 612.045 346.771 610.846C346.771 609.647 347.104 608.711 347.77 608.036C348.435 607.362 349.275 607.025 350.288 607.025C351.338 607.025 352.202 607.381 352.877 608.092ZM357.745 610.846C357.745 608.767 357.102 607.039 355.817 605.662C354.532 604.285 352.924 603.597 350.992 603.597C348.966 603.597 347.474 604.281 346.518 605.648V603.906H343.029V622.872H346.827V616.466C347.859 617.59 349.247 618.152 350.992 618.152C352.924 618.152 354.532 617.454 355.817 616.058C357.102 614.663 357.745 612.925 357.745 610.846ZM328.483 603.905V611.688C328.483 613.618 329.087 615.177 330.298 616.367C331.508 617.556 333.05 618.151 334.926 618.151C336.765 618.151 338.289 617.552 339.499 616.353C340.709 615.154 341.314 613.599 341.314 611.688V603.905H337.515V611.998C337.515 612.784 337.271 613.426 336.783 613.922C336.296 614.419 335.676 614.667 334.926 614.667C334.157 614.667 333.524 614.424 333.027 613.937C332.53 613.449 332.282 612.804 332.282 611.998V603.905H328.483ZM383.173 607.248V603.904C382.817 603.792 382.404 603.736 381.935 603.736C380.359 603.736 379.083 604.345 378.108 605.562V603.904H374.619V617.813H378.418V610.873C378.418 609.693 378.75 608.793 379.417 608.176C380.082 607.557 380.996 607.248 382.16 607.248H383.173ZM399.595 603.905V611.688C399.595 613.618 400.2 615.177 401.411 616.367C402.62 617.556 404.163 618.151 406.039 618.151C407.877 618.151 409.402 617.552 410.611 616.353C411.822 615.154 412.426 613.599 412.426 611.688V603.905H408.628V611.998C408.628 612.784 408.384 613.426 407.896 613.922C407.408 614.419 406.789 614.667 406.039 614.667C405.27 614.667 404.637 614.424 404.14 613.937C403.643 613.449 403.394 612.804 403.394 611.998V603.905H399.595ZM414.277 617.814H418.076V603.905H414.277V617.814ZM431.071 610.873C431.071 612.072 430.738 613.008 430.073 613.682C429.406 614.357 428.567 614.694 427.554 614.694C426.503 614.694 425.641 614.338 424.965 613.626C424.29 612.914 423.953 611.988 423.953 610.845C423.953 609.721 424.295 608.803 424.979 608.09C425.664 607.379 426.522 607.023 427.554 607.023C428.548 607.023 429.383 607.365 430.059 608.049C430.734 608.732 431.071 609.674 431.071 610.873ZM434.814 596.402H431.015V605.253C430.002 604.148 428.613 603.595 426.851 603.595C424.899 603.595 423.286 604.283 422.011 605.66C420.735 607.037 420.098 608.775 420.098 610.873C420.098 612.971 420.735 614.708 422.011 616.085C423.286 617.461 424.899 618.15 426.851 618.15C428.876 618.15 430.368 617.466 431.325 616.098V617.813H434.814V596.402ZM322.543 607.165L320.432 606.238C319.607 605.863 319.04 605.531 318.73 605.24C318.421 604.95 318.266 604.571 318.266 604.102C318.266 604.056 318.272 604.013 318.278 603.969L318.278 603.969C318.281 603.948 318.284 603.927 318.286 603.905H314.424C314.423 603.938 314.421 603.97 314.419 604.002C314.415 604.063 314.411 604.124 314.411 604.186C314.411 606.416 315.912 608.195 318.913 609.525L320.911 610.424C321.849 610.855 322.477 611.216 322.796 611.506C323.115 611.796 323.275 612.204 323.275 612.728C323.275 613.365 323.04 613.866 322.571 614.231C322.102 614.597 321.455 614.779 320.63 614.779C318.903 614.779 317.384 613.88 316.071 612.082L313.454 614.048C314.186 615.323 315.175 616.324 316.423 617.055C317.67 617.786 319.073 618.151 320.63 618.151C322.524 618.151 324.081 617.641 325.3 616.62C326.519 615.599 327.129 614.255 327.129 612.588C327.129 611.351 326.763 610.317 326.032 609.483C325.3 608.65 324.137 607.877 322.543 607.165ZM321.602 598.385H327.129V603.904H324.365V601.145H321.602V598.385Z" fill="white"/>
            <g style="mix-blend-mode:overlay">
                <rect x="38.5" y="38.5" width="623" height="623" rx="41" stroke="white" stroke-width="2"/>
            </g>
            <g style="mix-blend-mode:overlay">
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="16" letter-spacing="0px">
                    <tspan x="72.3097" y="26.74">SENDER: ${sender}</tspan>
                </text>
            </g>
            <g style="mix-blend-mode:overlay">
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="16" letter-spacing="0px">
                    <tspan x="72.3097" y="26.74">SENDER: ${sender}</tspan>
                </text>
            </g>
            <g style="mix-blend-mode:overlay">
                <text transform="translate(11.3097 439.5) rotate(-90)" fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="16" letter-spacing="0px">
                    <tspan x="0" y="15.74">START DATE: ${startDateStr}</tspan>
                </text>
            </g>
            <g style="mix-blend-mode:overlay">
                <text transform="translate(11.3097 439.5) rotate(-90)" fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="16" letter-spacing="0px">
                    <tspan x="0" y="15.74">START DATE: ${startDateStr}</tspan>
                </text>
            </g>
            <g style="mix-blend-mode:overlay">
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="16" letter-spacing="0px">
                    <tspan x="203.094" y="683.74">RECEIVER: ${receiver}</tspan>
                </text>
            </g>
            <g style="mix-blend-mode:overlay">
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="16" letter-spacing="0px">
                    <tspan x="203.094" y="683.74">RECEIVER: ${receiver}</tspan>
                </text>
            </g>
            <text stroke="white" stroke-width="3" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="120" letter-spacing="4.82212px"><tspan x="50%" y="274.8" dominant-baseline="middle" text-anchor="middle">${flowratePerMonth}</tspan></text>
            <g style="mix-blend-mode:screen" opacity="0.6" filter="url(#filter2_f_1906_250620)">
                <text stroke="white" stroke-width="3" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="120" letter-spacing="4.82212px"><tspan x="50%" y="274.8" dominant-baseline="middle" text-anchor="middle">${flowratePerMonth}</tspan></text>
            </g>
            <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="36.9231" letter-spacing="0px">
                <tspan x="203.07" y="337.592">${tokenSymbol} per month</tspan>
            </text>
            <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="36.9231" letter-spacing="0px">
                <tspan x="203.07" y="337.592">${tokenSymbol} per month</tspan>
            </text>
            <g style="mix-blend-mode:screen" opacity="0.6" filter="url(#filter3_f_1906_250620)">
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="36.9231" letter-spacing="0px">
                    <tspan x="203.07" y="337.592">${tokenSymbol} per month</tspan>
                </text>
            </g>
            <g filter="url(#filter4_b_1906_250620)">
                <rect x="92" y="415" width="242.301" height="114" rx="13.8442" fill="black" fill-opacity="0.1"/>
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="18" letter-spacing="0.138442px">
                    <tspan x="114.151" y="456.395">Sender</tspan>
                </text>
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="28" font-weight="bold" letter-spacing="0px">
                    <tspan x="114.151" y="497.67">${senderAbbr}</tspan>
                </text>
            </g>
            <g filter="url(#filter5_b_1906_250620)">
                <rect x="366" y="415" width="242.301" height="114" rx="13.8442" fill="black" fill-opacity="0.1"/>
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="18" letter-spacing="0.138442px">
                    <tspan x="388.151" y="456.395">Receiver</tspan>
                </text>
                <text fill="white" xml:space="preserve" style="white-space: pre" font-family="monospace" font-size="28" font-weight="bold" letter-spacing="0px">
                    <tspan x="388.151" y="497.67">${receiverAbbr}</tspan>
                </text>
            </g>
        </g>
        <defs>
            <filter id="filter0_f_1906_250620" x="-490.285" y="-63.3586" width="1200" height="1200" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_1906_250620"/>
            </filter>
            <filter id="filter1_f_1906_250620" x="-39.6169" y="-372.495" width="1200" height="1200" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_1906_250620"/>
            </filter>
            <filter id="filter2_f_1906_250620" x="0" y="177.86" width="700" height="200" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="6.5" result="effect1_foregroundBlur_1906_250620"/>
            </filter>
            <filter id="filter3_f_1906_250620" x="192.47" y="298.6" width="313.676" height="60.3384" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="6.5" result="effect1_foregroundBlur_1906_250620"/>
            </filter>
            <filter id="filter4_b_1906_250620" x="77" y="400" width="272.301" height="144" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.5"/>
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1906_250620"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1906_250620" result="shape"/>
            </filter>
            <filter id="filter5_b_1906_250620" x="351" y="400" width="272.301" height="144" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.5"/>
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1906_250620"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1906_250620" result="shape"/>
            </filter>
            <radialGradient id="paint0_radial_1906_250620" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(109.715 536.641) rotate(90) scale(695.531)">
                <stop stop-color="#627EEA"/>
                <stop offset="1" stop-color="#627EEA" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="paint1_radial_1906_250620" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(560.383 227.505) rotate(90) scale(695.531)">
                <stop stop-color="#0EB400"/>
                <stop offset="1" stop-color="#0EB400" stop-opacity="0"/>
            </radialGradient>
            <clipPath id="clip0_1906_250620">
                <rect width="700" height="700" fill="white"/>
            </clipPath>
        </defs>
    </svg>
    `;

    return {
      statusCode: 200,
      body: retStr,
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
