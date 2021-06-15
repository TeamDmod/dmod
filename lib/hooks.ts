export function getTimezone(): string {
	return new Date().toString().match(/([\w]*)-/)[1];
}
