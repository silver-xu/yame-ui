import { Component } from 'react';
interface ITickerProps {
    interval: number;
    enabled: boolean;
    action: () => void;
    beforeAction: () => void;
    afterAction: () => void;
}

export class Ticker extends Component<ITickerProps> {
    private interval?: NodeJS.Timeout;
    public componentDidMount() {
        const {
            interval,
            enabled,
            action,
            beforeAction,
            afterAction
        } = this.props;
        if (enabled) {
            this.interval = setInterval(() => {
                beforeAction();
                action();
                afterAction();
            }, interval);
        }
    }

    public componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    public render() {
        return null;
    }
}
