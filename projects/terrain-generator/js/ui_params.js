
// List user input variables in caps below
var USR_ROCK_COL_WIDTH;
var USR_SIN_AMP;
var USR_SIN_FREQ;
var USR_SIN_DEVIATION;
var USR_MTN_HEIGHT;
var USR_CLOUD_NUM;
var USR_CLOUD_HEIGHT;
var USR_CLOUD_WIDTH;
var USR_CLOUD_SPACING;


// Get the values of the HTML sliders
function updateUIParams()
{
	USR_ROCK_COL_WIDTH = document.getElementById("rockColWidthRange").valueAsNumber;
	USR_SIN_AMP = document.getElementById("sinAmpRange").valueAsNumber;
	USR_SIN_FREQ = document.getElementById("sinFreqRange").valueAsNumber;
	USR_SIN_DEVIATION = document.getElementById("sinDeviationRange").valueAsNumber;
	USR_MTN_HEIGHT = document.getElementById("mtnHeightRange").valueAsNumber;

	USR_CLOUD_NUM = document.getElementById("cloudNumRange").valueAsNumber;
	USR_CLOUD_HEIGHT = document.getElementById("cloudHeightRange").valueAsNumber;
	USR_CLOUD_WIDTH = document.getElementById("cloudWidthRange").valueAsNumber;
	USR_CLOUD_MAXH = document.getElementById("cloudMaxHRange").valueAsNumber;
	USR_CLOUD_MAXW = document.getElementById("cloudMaxWRange").valueAsNumber;
}