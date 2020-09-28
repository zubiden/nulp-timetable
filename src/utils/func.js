export const throttle = (callable, period, context = null) => {
    let timeoutId;
    let time;

    return function () {
        if (!context) {
            context = this
        }

        if (time) {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                if ((Date.now() - time) >= period) {
                    callable.apply(context, arguments);

                    time = Date.now();
                }
            }, period - (Date.now() - time));
        } else {
            callable.apply(context, arguments);

            time = Date.now();
        }
    }
}