import React, { useState, useEffect, useCallback } from 'react';
import {
  Flame, Phone, MapPin, X, Plus, Trash2, ChevronLeft, ShoppingBag,
  Info, Check, AlertTriangle, Settings, Home, Building2, Users,
  BellRing, Gauge, Square, SprayCan, BookOpen, ChevronRight,
  Waves, LogOut, Archive, BatteryCharging, Pencil
} from 'lucide-react';

const C = {
  red: '#ED1C24',
  redDark: '#B01319',
  ink: '#333333',
  inkSoft: '#767676',
  paper: '#F5F5F5',
  card: '#FFFFFF',
  line: '#E2E2E2',
  green: '#2F7A4E',
  greenBg: '#E7F1E9',
  amber: '#B4790F',
  amberBg: '#FBF1DF',
  grey: '#767676',
  greyBg: '#EFEFEF',
  navy: '#00205B',
};

const LOGO_DATA_URI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4gPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTguNDMgOTMuMjkiIHdpZHRoPSIzMDAiIGhlaWdodD0iMTQzIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzAwMjA1Yjt9LmNscy0ye2ZpbGw6I2JhMGMyZjt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9IkxhZ2VyXzIiIGRhdGEtbmFtZT0iTGFnZXIgMiI+PGcgaWQ9IkxhZ2VyXzEtMiIgZGF0YS1uYW1lPSJMYWdlciAxIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMTEuNjEsOTMuMTVsLTEuOTItMi43M0gxMDh2Mi43M2gtMS4zOFY4NS4zaDMuNWMxLjgsMCwyLjkxLDEsMi45MSwyLjQ5YTIuMzUsMi4zNSwwLDAsMS0xLjg3LDIuMzlsMi4xMiwzWk0xMTAsODYuNTZoLTJ2Mi42M2gyYzEsMCwxLjYxLS41MSwxLjYxLTEuMzJTMTExLDg2LjU2LDExMCw4Ni41NloiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMTguOSw5My4yOUE0LjA2LDQuMDYsMCwxLDEsMTIzLDg5LjIyLDQsNCwwLDAsMSwxMTguOSw5My4yOVptMC02Ljg1YTIuNjUsMi42NSwwLDAsMC0yLjY1LDIuNzgsMi42OSwyLjY5LDAsMCwwLDIuNjcsMi44LDIuNjUsMi42NSwwLDAsMCwyLjY1LTIuNzhBMi42OSwyLjY5LDAsMCwwLDExOC45LDg2LjQ0WiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEyOC4xNiw4OC42YzEuNjYuNCwyLjUyLDEsMi41MiwyLjMxLDAsMS40OC0xLjE1LDIuMzUtMi44LDIuMzVBNC44Miw0LjgyLDAsMCwxLDEyNC42MSw5MmwuODMtMWEzLjYsMy42LDAsMCwwLDIuNDcsMWMuODYsMCwxLjM5LS4zOSwxLjM5LTFzLS4zMS0uODctMS43Ny0xLjIxYy0xLjY3LS40LTIuNjEtLjg5LTIuNjEtMi4zNWEyLjQsMi40LDAsMCwxLDIuNjgtMi4yOSw0LjM3LDQuMzcsMCwwLDEsMi44NSwxbC0uNzQsMWEzLjU3LDMuNTcsMCwwLDAtMi4xMy0uODFjLS44MSwwLTEuMjguNDItMS4yOCwxUzEyNi42Niw4OC4yNCwxMjguMTYsODguNloiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMzguNzMsODYuNTRoLTQuNDR2MmgzLjk0djEuMjNoLTMuOTR2Mi4xMWg0LjV2MS4yM2gtNS44OFY4NS4zaDUuODJaIj48L3BhdGg+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTQ2LjEsOTMuMTVsLTEuOTMtMi43M2gtMS43MnYyLjczaC0xLjM4Vjg1LjNoMy40OWMxLjgxLDAsMi45MiwxLDIuOTIsMi40OWEyLjM1LDIuMzUsMCwwLDEtMS44NywyLjM5bDIuMTIsM1ptLTEuNjUtNi41OWgtMnYyLjYzaDJjMSwwLDEuNjItLjUxLDEuNjItMS4zMlMxNDUuNDcsODYuNTYsMTQ0LjQ1LDg2LjU2WiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE1My4zOSw5My4yOWE0LjA2LDQuMDYsMCwxLDEsNC4xMS00LjA3QTQsNCwwLDAsMSwxNTMuMzksOTMuMjlabTAtNi44NWEyLjY1LDIuNjUsMCwwLDAtMi42NSwyLjc4LDIuNjksMi42OSwwLDAsMCwyLjY3LDIuOCwyLjY1LDIuNjUsMCwwLDAsMi42NC0yLjc4QTIuNjksMi42OSwwLDAsMCwxNTMuMzksODYuNDRaIj48L3BhdGg+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTAxLjUxLDg1LjNIOTguNDJ2MS4yNmgzYzEsMCwxLjY5LjQ4LDEuNjksMS40MXMtLjY1LDEuNDItMS42OSwxLjQyaC0zdjMuNzZIOTkuOFY5MC42M2gxLjU1YzEuNzMsMCwzLjE0LS45MiwzLjE0LTIuNjlDMTA0LjQ5LDg2LjM0LDEwMy4zNCw4NS4zLDEwMS41MSw4NS4zWiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQzLjg2LDkwLjYzSDQyLjN2Mi41Mkg0MC45M1Y4NS4zMUg0NGMxLjgzLDAsMywxLDMsMi42M0M0Nyw4OS43MSw0NS41OSw5MC42Myw0My44Niw5MC42M1ptMC00LjA3SDQyLjN2Mi44M2gxLjYxYzEsMCwxLjY5LS41NywxLjY5LTEuNDJTNDQuOTQsODYuNTYsNDMuOTEsODYuNTZaIj48L3BhdGg+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTUuMzYsOTMuMTVINTMuOWwtLjc5LTEuODlINDkuNGwtLjgxLDEuODlINDcuMThsMy40NS03LjloMS4yOFpNNTEuMjUsODYuOSw0OS45LDkwaDIuN1oiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02Mi4xOSw5My4xNWwtMS45My0yLjczSDU4LjUzdjIuNzNINTcuMTVWODUuMzFoMy41YzEuODEsMCwyLjkyLDEsMi45MiwyLjQ5YTIuMzQsMi4zNCwwLDAsMS0xLjg4LDIuMzhsMi4xMiwzWm0tMS42NS02LjU5aC0yVjg5LjJoMmMxLDAsMS42MS0uNTIsMS42MS0xLjMzUzYxLjU2LDg2LjU2LDYwLjU0LDg2LjU2WiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTY5LDkzLjE1SDY3LjZWODYuNThINjUuMTFWODUuMzFoNi4zN3YxLjI3SDY5WiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTgwLjQ4LDkzLjI5YTQuMDYsNC4wNiwwLDEsMSw0LjEyLTQuMDdBNCw0LDAsMCwxLDgwLjQ4LDkzLjI5Wm0wLTYuODVhMi42NSwyLjY1LDAsMCwwLTIuNjUsMi43OEEyLjY5LDIuNjksMCwwLDAsODAuNSw5MmEyLjY1LDIuNjUsMCwwLDAsMi42NS0yLjc4QTIuNjksMi42OSwwLDAsMCw4MC40OCw4Ni40NFoiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik05Mi42NCw4Ni41Nkg4OC4xN1Y4OC43aDRWOTBoLTR2My4xOUg4Ni43OVY4NS4zMWg1Ljg1WiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE0Mi43NywxLjE2bC0xLjQyLDEuNDNhOC45NCw4Ljk0LDAsMCwxLDMuNzYsMy44cTEuMjcsMi43NiwxLjI4LDkuMzdWMThIMTMzVjEzLjg0YTE0LjUzLDE0LjUzLDAsMCwwLS4xOS0yLjY5bC00LjU1LDQuNTdhNi4zMiw2LjMyLDAsMCwwLC42MywyLjEzcS43MSwxLjQxLDQuMDcsMy4zOSw5LjYzLDUuNzMsMTIuMTMsOS4zOXQyLjUsMTEuODJxMCw1Ljk0LTEuMzgsOC43NGExMC45NCwxMC45NCwwLDAsMS01LjM3LDQuNzEsMTYuMTIsMTYuMTIsMCwwLDEtMS44Mi43NGgxMy4xVjEuMTZaIj48L3BhdGg+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjE4Ni40OCAxLjE3IDE3OC4yMiAyNi4yMSAxODcuMjcgNTYuNjQgMTg3LjI2IDU2LjY0IDE4Ny4yNiA1Ni42NCAxOTYuNzMgNTYuNjQgMTk2LjczIDEuMTYgMTg2LjQ4IDEuMTciPjwvcG9seWdvbj48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMTY2LjU0IDEuMTcgMTY2LjU0IDIyLjcyIDE3Mi45NSAxLjE3IDE2Ni41NCAxLjE3Ij48L3BvbHlnb24+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjE2Ni41NCAzMi44NiAxNjYuNTQgNTYuNjQgMTcyLjQxIDU2LjY0IDE2Ni41NCAzMi44NiI+PC9wb2x5Z29uPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTExNi4zNCw1MGEyOC44MywyOC44MywwLDAsMS0xLjI2LTkuNjNWMzYuNzZoMTMuMzl2Ni43NWMwLDIuMDguMTksMy40Mi41Nyw0YTIuMTgsMi4xOCwwLDAsMCwyLC44OSwyLjMzLDIuMzMsMCwwLDAsMi4xNC0xLjEzLDYuNCw2LjQsMCwwLDAsLjcxLTMuMzVxMC00LjkxLTEuMzQtNi40MWE0Mi4xOCw0Mi4xOCwwLDAsMC02Ljc1LTUsNjYuNTMsNjYuNTMsMCwwLDEtNy4xMy01LjE3LDEwLjIsMTAuMiwwLDAsMS0xLTFsLTcuNzQsNy43NmE2Mi4zLDYyLjMsMCwwLDEsLjMsNy45MlY1Ni42NEgxMjQuMWExNi41OCwxNi41OCwwLDAsMS0yLjM5LTFBMTAuNzgsMTAuNzgsMCwwLDEsMTE2LjM0LDUwWiI+PC9wYXRoPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSI5Ni44NSA0Ny4yMyA5Mi40NiA1MS42MiA5Mi40NiA1Ni42NCA5Mi40NiA1Ni42NSA5Ni44NSA1Ni42NSA5Ni44NSA1Ni42NCA5Ni44NSA0Ny4yMyI+PC9wb2x5Z29uPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxMy43NiAzMS40MiAyMS4yNiA1Ni42NCAzMy45IDU2LjY0IDMzLjkgMS4xNyAyMS44NCAxLjE3IDIxLjg0IDI2LjE0IDEzLjc2IDEuMTcgMS43IDEuMTcgMS43IDU2LjY0IDEzLjc2IDU2LjY0IDEzLjc2IDMxLjQyIj48L3BvbHlnb24+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNzIuNjYsMzMuNjV2LTkuNWExMTQuODQsMTE0Ljg0LDAsMCwwLS40Mi0xMkExMy4zMSwxMy4zMSwwLDAsMCw2NCwxLjQ2LDIwLjg5LDIwLjg5LDAsMCwwLDU2LDBhMjAuNDEsMjAuNDEsMCwwLDAtOC4yMywxLjU0QTEzLjMyLDEzLjMyLDAsMCwwLDQyLjE1LDZhMTMuMTgsMTMuMTgsMCwwLDAtMi40Nyw2LjM2LDExNy45LDExNy45LDAsMCwwLS40LDExLjgzdjkuNWExMTQuNzEsMTE0LjcxLDAsMCwwLC40MiwxMkExMy4zLDEzLjMsMCwwLDAsNDgsNTYuMzVhMTkuMTgsMTkuMTgsMCwwLDAsNC43NCwxLjI0bDE5LjkyLTIwUTcyLjY2LDM1LjgsNzIuNjYsMzMuNjVaTTU4LjIzLDQwLjkxYTI3LjA4LDI3LjA4LDAsMCwxLS40MSw2LjIsMS43NywxLjc3LDAsMCwxLTEuODksMS4zLDEuNzEsMS43MSwwLDAsMS0xLjgzLTEuMTMsMjUuNjksMjUuNjksMCwwLDEtLjM5LTZWMTUuNDJxMC00LjI5LjYtNS4xNkEyLDIsMCwwLDEsNTYsOS4zOWExLjcsMS43LDAsMCwxLDEuNzYsMS4wOCwxNywxNywwLDAsMSwuNDMsNC45NVoiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik05Mi40NiwxMC42NWE1LjM2LDUuMzYsMCwwLDEsMy40NS44MywzLjE3LDMuMTcsMCwwLDEsLjg0LDEuOTVMMTA2LjE2LDRhOS4yMyw5LjIzLDAsMCwwLTQuMDktMnEtMy42MS0uNzgtMTMuODItLjc5SDc4djMxTDkyLjQ2LDE3LjcyWiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTExNS40NiwyMS45NGwuMi0uMTdMMTM2LjQ4Ljg5bC4xNS0uMTlhMjcsMjcsMCwwLDAtNi4zNC0uNywyMC45MiwyMC45MiwwLDAsMC04Ljc3LDEuNjYsMTAuODgsMTAuODgsMCwwLDAtNS4yNiw0LjYxcS0xLjY0LDIuOTQtMS42Myw5LjMyQTIxLjI2LDIxLjI2LDAsMCwwLDExNS40NiwyMS45NFoiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik05Mi4zOSw0NS4wN2wuMDctLjA3VjMxLjYzYzIsMCwzLjIyLjM1LDMuNjgsMS4wNnMuNzEsMi41NC43MSw1LjUxdjIuNGwuMS0uMDlMMTA3LjM5LDMwbC4wNy0uMDdhMTIuNjcsMTIuNjcsMCwwLDAtNS4xNi0yLjI2cTQuNzMtLjQ1LDYuMzMtMi42OGMxLjA4LTEuNDgsMS42MS00LjM4LDEuNjEtOC43QTIyLjk0LDIyLjk0LDAsMCwwLDEwOSw3LjgxTDk3LjY0LDE5LjE1bC00LjU4LDQuNTlMNzgsMzguODFWNTYuNjRoMi44MmwuMDctLjA4WiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTcyLjM2LDQ0LjUxbC0uMTcuMjJMNTkuNDksNTcuNGwtLjE3LjE5YTE4LjUzLDE4LjUzLDAsMCwwLDQuODgtMS4zMywxMy4yMywxMy4yMywwLDAsMCw4LjA2LTEwLjc4QzcyLjMsNDUuMTksNzIuMzMsNDQuODYsNzIuMzYsNDQuNTFaIj48L3BhdGg+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTAuNiw3Ni4yYTIuOTEsMi45MSwwLDAsMCwxLjE2LTIuMzYsMi43MywyLjczLDAsMCwwLTEuMDYtMi4yMSw2Ljg5LDYuODksMCwwLDAtMi41Ny0xLDQuODQsNC44NCwwLDAsMCwyLjM3LTEuMTQsMi4zMywyLjMzLDAsMCwwLC42Ny0xLjY0LDIuOTEsMi45MSwwLDAsMC0uNTItMS42NkEzLjIxLDMuMjEsMCwwLDAsOS4yMSw2NWE4LjY3LDguNjcsMCwwLDAtMy4xLS4zOUgwdi4zMmEzLjE0LDMuMTQsMCwwLDEsMS4yLjE2LDEsMSwwLDAsMSwuNDYuNDMsNC4yNyw0LjI3LDAsMCwxLC4xMiwxLjMxdjguMjhhNC4xLDQuMSwwLDAsMS0uMTIsMS4zLjk0Ljk0LDAsMCwxLS40NS40M0EyLjc5LDIuNzksMCwwLDEsMCw3N3YuMzJINi40OEE2LjQ2LDYuNDYsMCwwLDAsMTAuNiw3Ni4yWk00Ljc3LDY1LjMxYTUsNSwwLDAsMSwyLC4yOCwyLjA4LDIuMDgsMCwwLDEsMSwuODNBMi43NiwyLjc2LDAsMCwxLDgsNjcuODJhMi43MSwyLjcxLDAsMCwxLS4zNCwxLjQsMi4zLDIuMywwLDAsMS0xLC44NSw0Ljg1LDQuODUsMCwwLDEtMiwuM1pNNSw3Ni4zN2ExLDEsMCwwLDEtLjI2LS43NnYtLjQ2bDAtNC4wOGE2LjI4LDYuMjgsMCwwLDEsMi4xNy4yOCwyLDIsMCwwLDEsMS4xLDEsMy40NiwzLjQ2LDAsMCwxLC4zNywxLjZBMi44NywyLjg3LDAsMCwxLDgsNzUuMzNhMi4yMywyLjIzLDAsMCwxLS45NSwxLDIuODgsMi44OCwwLDAsMS0xLjM2LjMzQTEsMSwwLDAsMSw1LDc2LjM3WiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM2LDc3LjMzVjc3YTEuNTcsMS41NywwLDAsMS0uODgtLjMyLDYsNiwwLDAsMS0uODQtMWwtMS4yMS0xLjctMS44My0yLjU3YTQuMjEsNC4yMSwwLDAsMCwxLjgtLjg4LDMuMDUsMy4wNSwwLDAsMCwxLTIuMzQsMy4xNSwzLjE1LDAsMCwwLS42OC0yLDMuNDIsMy40MiwwLDAsMC0xLjc0LTEuMTksMTMuMTUsMTMuMTUsMCwwLDAtMy4zOS0uMzJIMjIuMzV2LjMyYTMuMjMsMy4yMywwLDAsMSwxLjIxLjE2LDEsMSwwLDAsMSwuNDUuNDMsMy44NywzLjg3LDAsMCwxLC4xMywxLjMxdjguMjhhMy43MiwzLjcyLDAsMCwxLS4xMywxLjMuOTQuOTQsMCwwLDEtLjQ1LjQzLDIuNzYsMi43NiwwLDAsMS0xLjIxLjE3di4zMkgyOC45Vjc3YTMsMywwLDAsMS0xLjItLjE2LjkuOSwwLDAsMS0uNDUtLjQzLDMuODMsMy44MywwLDAsMS0uMTMtMS4zMVY3MS41NEgyOEwzMS4xLDc2bDEsMS4zOFptLTUuMzgtNy41OGExLjkxLDEuOTEsMCwwLDEtMSwuODUsNiw2LDAsMCwxLTIsLjI0aC0uNTRWNjUuMzFoMWEzLDMsMCwwLDEsMi4yMi42OUEyLjksMi45LDAsMCwxLDMxLDY4LjEzLDMuMTEsMy4xMSwwLDAsMSwzMC42Niw2OS43NVoiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01Ny4wNyw3NC44LDUyLjUyLDY0LjM4aC0uMThMNDcuOCw3NC41MmE3LjMyLDcuMzIsMCwwLDEtMS4wOSwxLjkyLDEuODYsMS44NiwwLDAsMS0xLjEyLjU3di4zMmg0LjIzVjc3YTMuNTcsMy41NywwLDAsMS0xLjI1LS4yMy44NC44NCwwLDAsMS0uNDMtLjc5LDIuNzEsMi43MSwwLDAsMSwuMjYtMUw0OSw3My43NGg0LjQ4bC42NywxLjU2Yy4xOC40Mi4yNy42Ni4yOS43MWExLjQ4LDEuNDgsMCwwLDEsMCwuMzUuNTMuNTMsMCwwLDEtLjIuNDQsMS45MywxLjkzLDAsMCwxLTEsLjIxaC0uMjZ2LjMyaDYuMTFWNzdhMS40MiwxLjQyLDAsMCwxLS45LS4zNEE2LjQ5LDYuNDksMCwwLDEsNTcuMDcsNzQuOFpNNDkuMjcsNzNsMi00LjM4TDUzLjEyLDczWiI+PC9wYXRoPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTY5LjEyLDY0LjYxdi4zMmEyLjE5LDIuMTksMCwwLDEsLjg5LjE5LDIuNjcsMi42NywwLDAsMSwuNzEuN2wuMy4zN3Y5YTIsMiwwLDAsMS0uNDEsMS40MSwyLjA5LDIuMDksMCwwLDEtMS40Ny40M3YuMzJoNC41NFY3N2gtLjMxYTEuOTMsMS45MywwLDAsMS0xLjE3LS4zOCwxLjczLDEuNzMsMCwwLDEtLjUxLTEuNDZWNjdsOC41OSwxMC42MWguMzNWNjdhMy44NiwzLjg2LDAsMCwxLC4xNS0xLjI5LDEuMSwxLjEsMCwwLDEsLjQzLS41NSwzLjIsMy4yLDAsMCwxLDEuMDgtLjI3di0uMzJINzguMDZ2LjMyYTEuNzksMS43OSwwLDAsMSwxLjUxLjU0QTIuNjEsMi42MSwwLDAsMSw3OS45MSw2N3Y1LjRsLTYuMjctNy44M1oiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMDEuNSw2NC45M2ExLjgzLDEuODMsMCwwLDEsMS41Mi41NCwyLjYyLDIuNjIsMCwwLDEsLjMzLDEuNTd2NS40bC02LjI3LTcuODNIOTIuNTZ2LjMyYTIuMTUsMi4xNSwwLDAsMSwuODkuMTksMi41MywyLjUzLDAsMCwxLC43MS43bC4zLjM3djlhMiwyLDAsMCwxLS40MSwxLjQxLDIuMDgsMi4wOCwwLDAsMS0xLjQ2LjQzdi4zMmg0LjUzVjc3aC0uMzFhMS45MywxLjkzLDAsMCwxLTEuMTctLjM4LDEuNzMsMS43MywwLDAsMS0uNTEtMS40NlY2N2w4LjU5LDEwLjYxaC4zM1Y2N2EzLjg2LDMuODYsMCwwLDEsLjE1LTEuMjksMS4xNiwxLjE2LDAsMCwxLC40My0uNTUsMy4yNywzLjI3LDAsMCwxLDEuMDgtLjI3di0uMzJIMTAxLjVaIj48L3BhdGg+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTI1LjI1LDY0LjkzYTIuODksMi44OSwwLDAsMSwxLjA3LjE3LjgzLjgzLDAsMCwxLC41OC44MywyLjA4LDIuMDgsMCwwLDEtLjEuNmMtLjA3LjIzLS4yNi43LS41NiwxLjM4bC0yLjUxLDUuNjNMMTIxLDY3LjIzcS0uNDQtMS0uNTEtMS4yNmExLjMsMS4zLDAsMCwxLS4wNy0uNC40Ni40NiwwLDAsMSwuMjEtLjQyLDIsMiwwLDAsMSwxLjEzLS4yMmguMnYtLjMyaC02LjA3di4zMmExLjUzLDEuNTMsMCwwLDEsMSwuNDFBMTMsMTMsMCwwLDEsMTE4LDY3LjUxbDQuMzIsMTAuMTFoLjMyTDEyNyw2Ny45YTEwLjQxLDEwLjQxLDAsMCwxLDEuMTctMi4yMiwyLjA4LDIuMDgsMCwwLDEsMS4yMy0uNzV2LS4zMmgtNC4xNFoiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNDkuMjcsNzUuODFhNC42Niw0LjY2LDAsMCwxLTIuODcuODJoLS43N2ExLjU3LDEuNTcsMCwwLDEtLjc5LS4xNS44LjgsMCwwLDEtLjM0LS4zOSw1Ljg3LDUuODcsMCwwLDEtLjA4LTEuMjhWNzEuMjJhMy4yOCwzLjI4LDAsMCwxLDEuNDEuMjQsMi4wNSwyLjA1LDAsMCwxLC44NS45Myw0LjcxLDQuNzEsMCwwLDEsLjQ4LDEuNzhoLjMzVjY3LjUxaC0uMzNhNC41NSw0LjU1LDAsMCwxLS43LDIuMjQsMi4wNywyLjA3LDAsMCwxLTEuNzkuNzdoLS4yNVY2NS4zNGgxLjM3YTcuNyw3LjcsMCwwLDEsMiwuMTcsMi44NCwyLjg0LDAsMCwxLDEuNC44OCw0LjQ5LDQuNDksMCwwLDEsLjc3LDJoLjMyVjY0LjYxSDEzOS41OXYuMzJIMTQwYTEuNTUsMS41NSwwLDAsMSwxLC4yNy44OS44OSwwLDAsMSwuMzUuNTEsNi43OCw2Ljc4LDAsMCwxLDAsMS4wN3Y4LjM5YTMuNzksMy43OSwwLDAsMS0uMTEsMS4xOS44NC44NCwwLDAsMS0uMzcuNDUsMS43OCwxLjc4LDAsMCwxLS44OS4yaC0uNDJ2LjMyaDExbC41Ny00aC0uMzRBNC41OCw0LjU4LDAsMCwxLDE0OS4yNyw3NS44MVoiPjwvcGF0aD48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNzMuOTEsNzUuNjJsLTMtNC4yN2E0LjIzLDQuMjMsMCwwLDAsMS43OS0uODgsMywzLDAsMCwwLDEtMi4zNCwzLjE0LDMuMTQsMCwwLDAtLjY3LTIsMy40OSwzLjQ5LDAsMCwwLTEuNzUtMS4xOSwxMy4xNSwxMy4xNSwwLDAsMC0zLjM5LS4zMkgxNjJ2LjMyYTMuMTQsMy4xNCwwLDAsMSwxLjIuMTYuOS45LDAsMCwxLC40NS40MywzLjg3LDMuODcsMCwwLDEsLjEzLDEuMzF2OC4yOGEzLjcyLDMuNzIsMCwwLDEtLjEzLDEuMy44Ni44NiwwLDAsMS0uNDUuNDNBMi43NCwyLjc0LDAsMCwxLDE2Miw3N3YuMzJoNi41NVY3N2EzLDMsMCwwLDEtMS4yMS0uMTYuOS45LDAsMCwxLS40NS0uNDMsNC4xMSw0LjExLDAsMCwxLS4xMy0xLjMxVjcxLjU0aC44NWw0LjExLDUuNzloNFY3N2ExLjYsMS42LDAsMCwxLS44OC0uMzJBNy4xOCw3LjE4LDAsMCwxLDE3My45MSw3NS42MlptLTMuNjUtNS44N2EyLDIsMCwwLDEtMSwuODUsNi4xNSw2LjE1LDAsMCwxLTIsLjI0aC0uNTRWNjUuMzFoMWEzLDMsMCwwLDEsMi4yMS42OSwyLjksMi45LDAsMCwxLC42OSwyLjEzQTMuMTEsMy4xMSwwLDAsMSwxNzAuMjYsNjkuNzVaIj48L3BhdGg+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTk0LjIxLDY0LjkzYTEuODMsMS44MywwLDAsMSwxLjUyLjU0LDIuNjIsMi42MiwwLDAsMSwuMzMsMS41N3Y1LjRsLTYuMjctNy44M2gtNC41MnYuMzJhMi4xNSwyLjE1LDAsMCwxLC44OS4xOSwyLjUzLDIuNTMsMCwwLDEsLjcxLjdsLjMuMzd2OWExLjkzLDEuOTMsMCwwLDEtLjQyLDEuNDEsMiwyLDAsMCwxLTEuNDUuNDN2LjMyaDQuNTNWNzdoLS4zMWExLjkzLDEuOTMsMCwwLDEtMS4xNy0uMzgsMS43MywxLjczLDAsMCwxLS41MS0xLjQ2VjY3bDguNTksMTAuNjFoLjMzVjY3YTMuODYsMy44NiwwLDAsMSwuMTUtMS4yOSwxLjE2LDEuMTYsMCwwLDEsLjQzLS41NSwzLjIxLDMuMjEsMCwwLDEsMS4wOS0uMjd2LS4zMmgtNC4yMloiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPiA=";

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
.nb-app { font-family: 'Inter', system-ui, sans-serif; color: ${C.ink}; }
.nb-app h1, .nb-app h2, .nb-app h3, .nb-app .nb-display { font-family: 'Barlow Semi Condensed', 'Inter', sans-serif; }
.nb-app input[type="date"], .nb-app input[type="text"] {
  font-family: 'Inter', sans-serif;
}
.nb-app ::placeholder { color: ${C.grey}; }
.nb-btn-press:active { transform: scale(0.97); }
`;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(iso) {
  if (!iso) return 'Ikke satt';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  return `${d}.${m}.${y}`;
}

function addYears(iso, years) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

function daysUntil(iso) {
  const target = new Date(iso + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

function statusFrom(iso) {
  if (!iso) return { label: 'Ikke satt', fg: C.grey, bg: C.greyBg };
  const d = daysUntil(iso);
  if (d < 0) return { label: 'Forfalt', fg: C.red, bg: '#FBE7E7' };
  if (d <= 30) return { label: 'Snart', fg: C.amber, bg: C.amberBg };
  return { label: 'OK', fg: C.green, bg: C.greenBg };
}

function addMonths(iso, months) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function commonCheckStatus(c, months) {
  if (c.ok === 'nei') return { label: 'Avvik', fg: C.red, bg: '#FBE7E7' };
  if (!c.lastChecked) return { label: 'Ikke sjekket', fg: C.grey, bg: C.greyBg };
  return statusFrom(addMonths(c.lastChecked, months));
}

const COMMON_CHECKS = [
  { key: 'brannslange', title: 'Brannslange', icon: Waves, desc: 'Sjekk jevnlig at brannslangen er tilgjengelig og i god stand.', question: 'Er brannslangen i orden og lett tilgjengelig?', months: 12 },
  { key: 'escape', title: 'Rømningsveier', icon: LogOut, desc: 'Sjekk at trapper, ganger og nødutganger er fri for hindringer.', question: 'Er rømningsveiene fri for hindringer?', months: 3 },
  { key: 'storage', title: 'Boder', icon: Archive, desc: 'Sjekk at boder og fellesareal er ryddet og fri for brannfarlig opplagring.', question: 'Er bodene ryddet og fri for brannfarlig opplagring?', months: 3 },
  { key: 'escooter', title: 'Elsparkesykler og lading', icon: BatteryCharging, desc: 'Sjekk at lading skjer trygt – ikke i rømningsvei, og ikke uten tilsyn over natten.', question: 'Er ladeplassen i orden?', months: 1 },
];

async function loadKey(key, fallback) {
  try {
    const res = await window.storage.get(key, false);
    if (res && res.value != null) return JSON.parse(res.value);
    return fallback;
  } catch (e) {
    return fallback;
  }
}

async function saveKey(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), false);
  } catch (e) {
    console.error('Lagring feilet', e);
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const PROFILE_LABEL = {
  borettslag: 'Borettslag',
  sameie: 'Sameie / velforening',
  privat: 'Privatperson',
};

const RESPONSIBILITY = {
  borettslag: 'Styret har ansvar for brannsikkerheten i fellesarealene.',
  sameie: 'Styret har ansvar for brannsikkerheten i fellesarealene.',
  privat: 'Du har ansvar for brannsikkerheten i boligen din.',
};

function StatusPill({ status }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 12, fontWeight: 600, padding: '3px 9px', borderRadius: 100,
      color: status.fg, background: status.bg, whiteSpace: 'nowrap',
    }}>
      {status.label}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.line}`, borderRadius: 14,
      padding: 16, ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
      <button onClick={onBack} className="nb-btn-press" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.line}`,
        background: C.card, cursor: 'pointer', flexShrink: 0,
      }} aria-label="Tilbake">
        <ChevronLeft size={18} color={C.ink} />
      </button>
      <h2 style={{ fontSize: 21, fontWeight: 700, margin: 0 }}>{title}</h2>
    </div>
  );
}

function Toggle3({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} className="nb-btn-press" style={{
            flex: 1, padding: '9px 8px', borderRadius: 10, cursor: 'pointer',
            fontSize: 13.5, fontWeight: 600,
            border: `1px solid ${active ? C.ink : C.line}`,
            background: active ? C.ink : C.card,
            color: active ? '#fff' : C.inkSoft,
          }}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>{label}</div>
      <input
        type="date"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '9px 10px',
          borderRadius: 9, border: `1px solid ${C.line}`, fontSize: 14.5,
          background: C.card, color: C.ink,
        }}
      />
    </label>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>{label}</div>
      <input
        type="text"
        value={value || ''}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '9px 10px',
          borderRadius: 9, border: `1px solid ${C.line}`, fontSize: 14.5,
          background: C.card, color: C.ink,
        }}
      />
    </label>
  );
}

function OrderCard({ text, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      textDecoration: 'none', background: C.amberBg, border: `1px solid #E9CE9A`,
      borderRadius: 12, padding: '13px 14px', marginTop: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ShoppingBag size={18} color={C.amber} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#7A5209' }}>{text}</span>
      </div>
      <ChevronRight size={16} color={C.amber} />
    </a>
  );
}

// ---------- Onboarding ----------

function Onboarding({ onSelect }) {
  const options = [
    { value: 'borettslag', label: 'Borettslag', icon: Building2, desc: 'Felles brannsikkerhet for hele bygget' },
    { value: 'sameie', label: 'Sameie / velforening', icon: Users, desc: 'Styret har ansvar for oppfølging' },
    { value: 'privat', label: 'Privatperson', icon: Home, desc: 'Egen bolig eller hytte' },
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(27,26,23,0.55)',
      display: 'flex', alignItems: 'flex-end', zIndex: 30, borderRadius: 26,
    }}>
      <div style={{
        width: '100%', background: C.paper, borderRadius: '22px 22px 0 0',
        padding: '26px 20px 24px', boxSizing: 'border-box',
      }}>
        <div style={{ width: 36, height: 4, background: C.line, borderRadius: 4, margin: '0 auto 18px' }} />
        <h1 style={{ fontSize: 23, fontWeight: 700, margin: '0 0 4px' }}>Hvem er du her på vegne av?</h1>
        <p style={{ fontSize: 14, color: C.inkSoft, margin: '0 0 18px' }}>
          Dette huskes til neste gang du åpner appen.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map(opt => {
            const Icon = opt.icon;
            return (
              <button key={opt.value} onClick={() => onSelect(opt.value)} className="nb-btn-press" style={{
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                padding: '13px 14px', borderRadius: 13, border: `1px solid ${C.line}`,
                background: C.card, cursor: 'pointer',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: C.paper,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={19} color={C.ink} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{opt.label}</div>
                  <div style={{ fontSize: 12.5, color: C.inkSoft }}>{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Emergency sheet ----------

function EmergencySheet({ onClose }) {
  const showPrototypeNotice = () => {
    alert('Dette er bare en prototype');
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(27,26,23,0.6)',
      display: 'flex', alignItems: 'flex-end', zIndex: 40, borderRadius: 26,
    }}>
      <div style={{
        width: '100%', background: C.paper, borderRadius: '22px 22px 0 0',
        padding: '22px 20px 26px', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Er det brann?</h1>
            <p style={{ fontSize: 13.5, color: C.inkSoft, margin: '4px 0 0' }}>Ring 110 og del posisjonen din med nødetatene.</p>
          </div>
          <button onClick={onClose} aria-label="Lukk" className="nb-btn-press" style={{
            width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.line}`,
            background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          }}>
            <X size={16} color={C.ink} />
          </button>
        </div>

        <button onClick={showPrototypeNotice} className="nb-btn-press" style={{
          marginTop: 16, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: C.red, color: '#fff', border: 'none', textDecoration: 'none',
          borderRadius: 14, padding: '16px 18px', fontSize: 19, fontWeight: 700, cursor: 'pointer',
        }}>
          <Phone size={20} /> Ring 110 nå
        </button>

        <button onClick={showPrototypeNotice} className="nb-btn-press" style={{
          marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
          background: C.card, border: `1px solid ${C.line}`, color: C.ink,
          borderRadius: 14, padding: '13px 18px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          <MapPin size={17} /> Del posisjon med nødetatene
        </button>

        <p style={{ fontSize: 12, color: C.grey, marginTop: 12, lineHeight: 1.5 }}>
          I den ferdige appen sendes posisjon og adresse automatisk til nødsentralen sammen med samtalen.
        </p>
      </div>
    </div>
  );
}

// ---------- Home ----------

function FeatureRow({ icon: Icon, title, subtitle, onClick, accent }) {
  return (
    <button onClick={onClick} className="nb-btn-press" style={{
      display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left',
      background: accent ? C.navy : C.card, border: `1px solid ${accent ? C.navy : C.line}`, borderRadius: 14,
      padding: '13px 14px', cursor: 'pointer', marginBottom: 10,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 11, background: accent ? 'rgba(255,255,255,0.16)' : C.paper,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={19} color={accent ? '#fff' : C.ink} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: accent ? '#fff' : C.ink }}>{title}</div>
        <div style={{ fontSize: 12.5, color: accent ? 'rgba(255,255,255,0.75)' : C.inkSoft }}>{subtitle}</div>
      </div>
      <ChevronRight size={17} color={accent ? 'rgba(255,255,255,0.75)' : C.grey} />
    </button>
  );
}

function Home_({ profileType, onNav, onOpenEmergency, onSwitchProfile, smokeDetectors, powderExtinguishers, blanket, foam, commonChecks }) {
  const worstSmoke = smokeDetectors.length === 0 ? 'Ingen lagt til' :
    (() => {
      const statuses = smokeDetectors.map(d => statusFrom(d.lastChanged ? addYears(d.lastChanged, 1) : ''));
      if (statuses.some(s => s.label === 'Forfalt')) return 'En eller flere er forfalt';
      if (statuses.some(s => s.label === 'Snart')) return 'En eller flere bør sjekkes snart';
      return `${smokeDetectors.length} registrert – alt OK`;
    })();

  const worstPowder = powderExtinguishers.length === 0 ? 'Ingen lagt til' :
    (() => {
      const statuses = powderExtinguishers.map(p => statusFrom(p.lastService ? addYears(p.lastService, 5) : ''));
      if (statuses.some(s => s.label === 'Forfalt')) return 'En eller flere er forfalt';
      if (statuses.some(s => s.label === 'Snart')) return 'En eller flere bør sjekkes snart';
      return `${powderExtinguishers.length} registrert – alt OK`;
    })();
  const blanketStatus = blanket.knows === true ? 'Vet hvor det er' : blanket.knows === false ? 'Bør bestilles' : 'Ikke svart';
  const foamStatus = foam.knows === false ? 'Bør bestilles' : foam.expires ? statusFrom(foam.expires).label : 'Ikke registrert';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', margin: '0 -20px 20px -20px', padding: '16px 20px', borderRadius: 0 }}>
        <img src={LOGO_DATA_URI} alt="Norsk Brannvern" style={{ width: 148, height: 'auto', display: 'block' }} />
        <button onClick={onSwitchProfile} aria-label="Bytt profil" className="nb-btn-press" style={{
          width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.line}`,
          background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Settings size={16} color={C.inkSoft} />
        </button>
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.inkSoft, marginBottom: 2 }}>
        {PROFILE_LABEL[profileType] || ''}
      </div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 18, lineHeight: 1.4 }}>
        {RESPONSIBILITY[profileType] || ''}
      </div>

      <button onClick={onOpenEmergency} className="nb-btn-press" style={{
        width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
        background: C.red, borderRadius: 18, padding: '20px 20px', marginBottom: 22,
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: `0 6px 0 ${C.redDark}`,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.16)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Flame size={26} color="#fff" />
        </div>
        <div>
          <div className="nb-display" style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>Brenner det?</div>
          <div className="nb-display" style={{ fontSize: 19, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginTop: 4 }}>Ring 110 her</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>(din posisjon deles)</div>
        </div>
      </button>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10 }}>
        Sjekkliste
      </div>

      <FeatureRow icon={BellRing} title="Røykvarslere" subtitle={worstSmoke} onClick={() => onNav('smoke')} />
      <FeatureRow icon={Gauge} title="Pulverapparat" subtitle={worstPowder} onClick={() => onNav('powder')} />
      <FeatureRow icon={Square} title="Brannteppe" subtitle={blanketStatus} onClick={() => onNav('blanket')} />
      <FeatureRow icon={SprayCan} title="Slokkeskum" subtitle={foamStatus} onClick={() => onNav('foam')} />

      {(profileType === 'borettslag' || profileType === 'sameie') && (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: 0.4, margin: '16px 0 10px' }}>
            Fellesareal
          </div>
          {COMMON_CHECKS.map(cfg => {
            const c = commonChecks[cfg.key];
            const status = commonCheckStatus(c, cfg.months);
            return (
              <FeatureRow key={cfg.key} icon={cfg.icon} title={cfg.title} subtitle={status.label} onClick={() => onNav('common', cfg.key)} />
            );
          })}
        </>
      )}

      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.grey, textTransform: 'uppercase', letterSpacing: 0.4, margin: '16px 0 10px' }}>
        Mer
      </div>
      <FeatureRow icon={BookOpen} title="Tips til brannvern" subtitle="Gode vaner i hverdagen" onClick={() => onNav('tips')} accent />
    </div>
  );
}

// ---------- Smoke detectors ----------

function SmokeView({ detectors, setDetectors, onBack }) {
  const update = (id, patch) => {
    const next = detectors.map(d => d.id === id ? { ...d, ...patch } : d);
    setDetectors(next);
  };
  const remove = id => setDetectors(detectors.filter(d => d.id !== id));
  const add = () => setDetectors([...detectors, { id: uid(), name: '', lastChanged: '' }]);

  return (
    <div>
      <SectionHeader title="Røykvarslere" onBack={onBack} />
      <p style={{ fontSize: 13.5, color: C.inkSoft, marginTop: -10, marginBottom: 16 }}>
        Registrer når du sist byttet batteri. Vi foreslår sjekk hvert år.
      </p>
      {detectors.length === 0 && (
        <Card style={{ textAlign: 'center', color: C.grey, fontSize: 13.5, marginBottom: 14 }}>
          Ingen røykvarslere lagt til enda.
        </Card>
      )}
      {detectors.map(det => {
        const nextCheck = det.lastChanged ? addYears(det.lastChanged, 1) : '';
        const status = statusFrom(nextCheck);
        return (
          <Card key={det.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, flex: 1, minWidth: 0 }}>
                <Pencil size={13} color={C.grey} style={{ flexShrink: 0, marginBottom: 4 }} />
                <input
                  type="text"
                  value={det.name}
                  placeholder="F.eks. Røykvarsler stue"
                  onChange={e => update(det.id, { name: e.target.value })}
                  style={{
                    flex: 1, fontSize: 15, fontWeight: 700, border: 'none', borderBottom: `1px dashed ${C.line}`,
                    outline: 'none', background: 'transparent', padding: '0 0 4px 0', color: C.ink, minWidth: 0,
                  }}
                />
              </div>
              <button onClick={() => remove(det.id)} aria-label="Slett" className="nb-btn-press" style={{
                border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, flexShrink: 0,
              }}>
                <Trash2 size={16} color={C.grey} />
              </button>
            </div>
            <div style={{ marginTop: 10 }}>
              <DateField label="Sist byttet batteri" value={det.lastChanged} onChange={v => update(det.id, { lastChanged: v })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12.5, color: C.inkSoft }}>Bør sjekkes: {fmtDate(nextCheck)}</span>
              <StatusPill status={status} />
            </div>
          </Card>
        );
      })}
      <button onClick={add} className="nb-btn-press" style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        border: `1px dashed ${C.line}`, borderRadius: 13, padding: '13px', background: 'transparent',
        cursor: 'pointer', fontSize: 14, fontWeight: 600, color: C.inkSoft,
      }}>
        <Plus size={16} /> Legg til røykvarsler
      </button>
    </div>
  );
}

// ---------- Powder extinguisher ----------

function PowderView({ items, setItems, onBack }) {
  const update = (id, patch) => {
    const next = items.map(p => p.id === id ? { ...p, ...patch } : p);
    setItems(next);
  };
  const remove = id => setItems(items.filter(p => p.id !== id));
  const add = () => setItems([...items, { id: uid(), name: '', lastFlipped: '', pressureOk: null, lastService: '' }]);

  return (
    <div>
      <SectionHeader title="Pulverapparat" onBack={onBack} />
      <p style={{ fontSize: 13.5, color: C.inkSoft, marginTop: -10, marginBottom: 16 }}>
        Registrer status på hvert apparat. Vi foreslår service hvert 5. år.
      </p>
      {items.length === 0 && (
        <Card style={{ textAlign: 'center', color: C.grey, fontSize: 13.5, marginBottom: 14 }}>
          Ingen pulverapparat lagt til enda.
        </Card>
      )}
      {items.map(p => {
        const nextService = p.lastService ? addYears(p.lastService, 5) : '';
        const status = statusFrom(nextService);
        return (
          <Card key={p.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, flex: 1, minWidth: 0 }}>
                <Pencil size={13} color={C.grey} style={{ flexShrink: 0, marginBottom: 4 }} />
                <input
                  type="text"
                  value={p.name}
                  placeholder="F.eks. Pulverapparat gang"
                  onChange={e => update(p.id, { name: e.target.value })}
                  style={{
                    flex: 1, fontSize: 15, fontWeight: 700, border: 'none', borderBottom: `1px dashed ${C.line}`,
                    outline: 'none', background: 'transparent', padding: '0 0 4px 0', color: C.ink, minWidth: 0,
                  }}
                />
              </div>
              <button onClick={() => remove(p.id)} aria-label="Slett" className="nb-btn-press" style={{
                border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, flexShrink: 0,
              }}>
                <Trash2 size={16} color={C.grey} />
              </button>
            </div>

            <DateField label="Når snudde du den sist?" value={p.lastFlipped} onChange={v => update(p.id, { lastFlipped: v })} />

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>Er trykket i orden?</div>
              <Toggle3
                value={p.pressureOk}
                onChange={v => update(p.id, { pressureOk: v })}
                options={[{ value: 'ja', label: 'Ja' }, { value: 'nei', label: 'Nei' }, { value: 'usikker', label: 'Usikker' }]}
              />
            </div>

            <DateField label="Når var forrige service?" value={p.lastService} onChange={v => update(p.id, { lastService: v })} />

            <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12.5, color: C.inkSoft }}>Neste service</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{fmtDate(nextService)}</div>
              </div>
              <StatusPill status={status} />
            </div>
          </Card>
        );
      })}
      <button onClick={add} className="nb-btn-press" style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        border: `1px dashed ${C.line}`, borderRadius: 13, padding: '13px', background: 'transparent',
        cursor: 'pointer', fontSize: 14, fontWeight: 600, color: C.inkSoft,
      }}>
        <Plus size={16} /> Legg til pulverapparat
      </button>
      <p style={{ fontSize: 12, color: C.grey, marginTop: 10, lineHeight: 1.5 }}>
        Basert på vanlig 5-års serviceintervall. Sjekk etiketten på ditt apparat for eksakt frist.
      </p>
    </div>
  );
}

// ---------- Fire blanket ----------

function BlanketView({ blanket, setBlanket, onBack }) {
  const set = patch => setBlanket({ ...blanket, ...patch });
  return (
    <div>
      <SectionHeader title="Brannteppe" onBack={onBack} />
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 8 }}>Vet du hvor du har brannteppet ditt?</div>
        <Toggle3
          value={blanket.knows === true ? 'ja' : blanket.knows === false ? 'nei' : null}
          onChange={v => set({ knows: v === 'ja' })}
          options={[{ value: 'ja', label: 'Ja' }, { value: 'nei', label: 'Nei' }]}
        />
        {blanket.knows === true && (
          <div style={{ marginTop: 12 }}>
            <TextField label="Hvor er det plassert?" value={blanket.location} placeholder="F.eks. kjøkkenskap" onChange={v => set({ location: v })} />
          </div>
        )}
        {blanket.knows === false && (
          <OrderCard text="Bestill brannteppe" url="https://norskbrannvern.no/nettbutikk/nyhet-brannteppe-120x120-silikonbelagt/" />
        )}
      </Card>
    </div>
  );
}

// ---------- Foam extinguisher ----------

function FoamView({ foam, setFoam, onBack }) {
  const set = patch => setFoam({ ...foam, ...patch });
  const status = statusFrom(foam.expires);

  return (
    <div>
      <SectionHeader title="Slokkeskum" onBack={onBack} />
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 8 }}>Vet du hvor du har slokkeskummet ditt?</div>
        <Toggle3
          value={foam.knows === true ? 'ja' : foam.knows === false ? 'nei' : null}
          onChange={v => set({ knows: v === 'ja' })}
          options={[{ value: 'ja', label: 'Ja' }, { value: 'nei', label: 'Nei' }]}
        />
        {foam.knows === true && (
          <div style={{ marginTop: 12 }}>
            <TextField label="Hvor er det plassert?" value={foam.location} placeholder="F.eks. bod" onChange={v => set({ location: v })} />
          </div>
        )}
        {foam.knows === false && (
          <div style={{ marginTop: 12 }}>
            <OrderCard text="Bestill slokkeskum" url="https://norskbrannvern.no/nettbutikk/110-slokkeskum-multipro/" />
          </div>
        )}
      </Card>

      <div style={{ height: 12 }} />

      <Card>
        <DateField label="Kjøpt" value={foam.purchased} onChange={v => set({ purchased: v })} />
        <DateField label="Utløper" value={foam.expires} onChange={v => set({ expires: v })} />
        {!foam.expires && foam.purchased && (
          <button onClick={() => set({ expires: addYears(foam.purchased, 5) })} className="nb-btn-press" style={{
            fontSize: 12.5, fontWeight: 600, color: C.inkSoft, background: 'transparent',
            border: 'none', cursor: 'pointer', padding: 0, marginBottom: 10, textDecoration: 'underline',
          }}>
            Foreslå utløpsdato (kjøpt + 5 år)
          </button>
        )}
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: C.inkSoft }}>Bør byttes innen</div>
          <StatusPill status={status} />
        </div>
      </Card>
    </div>
  );
}

// ---------- Tips ----------

// ---------- Common area checks (borettslag / sameie) ----------

function CommonCheckView({ checkKey, commonChecks, setCommonChecks, onBack }) {
  const cfg = COMMON_CHECKS.find(c => c.key === checkKey);
  const c = commonChecks[cfg.key];
  const set = patch => setCommonChecks({ ...commonChecks, [cfg.key]: { ...c, ...patch } });
  const status = commonCheckStatus(c, cfg.months);

  return (
    <div>
      <SectionHeader title={cfg.title} onBack={onBack} />
      <p style={{ fontSize: 13.5, color: C.inkSoft, marginTop: -10, marginBottom: 16 }}>{cfg.desc}</p>
      <Card>
        <DateField label="Sist sjekket" value={c.lastChecked} onChange={v => set({ lastChecked: v })} />
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>{cfg.question}</div>
          <Toggle3
            value={c.ok}
            onChange={v => set({ ok: v })}
            options={[{ value: 'ja', label: 'Ja' }, { value: 'nei', label: 'Nei' }, { value: 'usikker', label: 'Usikker' }]}
          />
        </div>
        <TextField label="Notat (valgfritt)" value={c.note} placeholder="F.eks. hva som bør følges opp" onChange={v => set({ note: v })} />
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, color: C.inkSoft }}>Status</div>
          <StatusPill status={status} />
        </div>
      </Card>
    </div>
  );
}

const TIPS = [
  { title: 'Test røykvarsleren en gang i måneden', body: 'Trykk på testknappen og bytt batteri minst én gang i året, gjerne i forbindelse med Røykvarslerens dag i desember.' },
  { title: 'Ha en avtalt møteplass', body: 'Bli enige om hvor familien eller beboerne møtes utenfor bygget dersom det oppstår brann, slik at dere raskt kan telle opp.' },
  { title: 'Rydd rømningsveier', body: 'Sjekk jevnlig at trapper, ganger og balkonger er fri for gjenstander som kan hindre en rask evakuering.' },
  { title: 'Kjenn slokkeutstyret ditt', body: 'Vet du hvor brannslukningsapparatet og brannteppet er plassert – og hvordan de brukes – sparer du dyrebare sekunder.' },
  { title: 'Vær ekstra obs ved matlaging', body: 'De fleste boligbranner starter på kjøkkenet. Ikke forlat komfyren mens du steker, og hold brannteppet i nærheten.' },
  { title: 'Sjekk det elektriske anlegget', body: 'Overbelastede stikkontakter og gamle skjøteledninger er en vanlig brannårsak – få anlegget kontrollert med jevne mellomrom.' },
];

function TipsView({ onBack }) {
  return (
    <div>
      <SectionHeader title="Tips til brannvern" onBack={onBack} />
      {TIPS.map((tip, i) => (
        <Card key={i} style={{ marginBottom: 10, display: 'flex', gap: 12 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, background: C.paper, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.inkSoft,
          }}>
            {i + 1}
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 3 }}>{tip.title}</div>
            <div style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>{tip.body}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---------- App ----------

export default function App() {
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState(null);
  const [view, setView] = useState('home');
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const [activeCommonCheck, setActiveCommonCheck] = useState(null);
  const [smokeDetectors, setSmokeDetectorsState] = useState([]);
  const [powderExtinguishers, setPowderExtinguishersState] = useState([]);
  const [blanket, setBlanketState] = useState({ knows: null, location: '' });
  const [foam, setFoamState] = useState({ knows: null, location: '', purchased: '', expires: '' });
  const defaultCommonChecks = {
    brannslange: { lastChecked: '', ok: null, note: '' },
    escape: { lastChecked: '', ok: null, note: '' },
    storage: { lastChecked: '', ok: null, note: '' },
    escooter: { lastChecked: '', ok: null, note: '' },
  };
  const [commonChecks, setCommonChecksState] = useState(defaultCommonChecks);

  useEffect(() => {
    (async () => {
      const [pt, sd, pw, bl, fm, cc] = await Promise.all([
        loadKey('nb-profile-type', null),
        loadKey('nb-smoke-detectors', []),
        loadKey('nb-powder-extinguishers', []),
        loadKey('nb-blanket', { knows: null, location: '' }),
        loadKey('nb-foam', { knows: null, location: '', purchased: '', expires: '' }),
        loadKey('nb-common-checks', defaultCommonChecks),
      ]);
      setProfileType(pt);
      setSmokeDetectorsState(sd);
      setPowderExtinguishersState(pw);
      setBlanketState(bl);
      setFoamState(fm);
      setCommonChecksState(cc);
      setLoading(false);
    })();
  }, []);

  const setSmokeDetectors = useCallback(next => {
    setSmokeDetectorsState(next);
    saveKey('nb-smoke-detectors', next);
  }, []);
  const setPowderExtinguishers = useCallback(next => {
    setPowderExtinguishersState(next);
    saveKey('nb-powder-extinguishers', next);
  }, []);
  const setBlanket = useCallback(next => {
    setBlanketState(next);
    saveKey('nb-blanket', next);
  }, []);
  const setFoam = useCallback(next => {
    setFoamState(next);
    saveKey('nb-foam', next);
  }, []);
  const setCommonChecks = useCallback(next => {
    setCommonChecksState(next);
    saveKey('nb-common-checks', next);
  }, []);

  const selectProfile = type => {
    setProfileType(type);
    saveKey('nb-profile-type', type);
  };

  const nav = (id, param) => {
    if (id === 'common') setActiveCommonCheck(param);
    setView(id);
  };

  return (
    <div className="nb-app" style={{ display: 'flex', justifyContent: 'center', padding: '18px 12px' }}>
      <style>{FONTS_CSS}</style>
      <div style={{
        position: 'relative', width: '100%', maxWidth: 400, minHeight: 700,
        background: C.paper, borderRadius: 26, border: `1px solid ${C.line}`,
        padding: 20, boxSizing: 'border-box', overflow: 'hidden',
      }}>
        <div style={{ background: '#FFD100', margin: '-20px -20px 0 -20px', padding: '6px 20px', borderRadius: '26px 26px 0 0', textAlign: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: '#000' }}>PROTOTYPE</span>
        </div>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 660, color: C.grey, fontSize: 14 }}>
            Laster …
          </div>
        ) : (
          <>
            {view === 'home' && (
              <Home_
                profileType={profileType}
                onNav={nav}
                onOpenEmergency={() => setEmergencyOpen(true)}
                onSwitchProfile={() => setProfileType(null)}
                smokeDetectors={smokeDetectors}
                powderExtinguishers={powderExtinguishers}
                blanket={blanket}
                foam={foam}
                commonChecks={commonChecks}
              />
            )}
            {view === 'smoke' && (
              <SmokeView detectors={smokeDetectors} setDetectors={setSmokeDetectors} onBack={() => setView('home')} />
            )}
            {view === 'powder' && (
              <PowderView items={powderExtinguishers} setItems={setPowderExtinguishers} onBack={() => setView('home')} />
            )}
            {view === 'blanket' && (
              <BlanketView blanket={blanket} setBlanket={setBlanket} onBack={() => setView('home')} />
            )}
            {view === 'foam' && (
              <FoamView foam={foam} setFoam={setFoam} onBack={() => setView('home')} />
            )}
            {view === 'common' && activeCommonCheck && (
              <CommonCheckView checkKey={activeCommonCheck} commonChecks={commonChecks} setCommonChecks={setCommonChecks} onBack={() => setView('home')} />
            )}
            {view === 'tips' && (
              <TipsView onBack={() => setView('home')} />
            )}
          </>
        )}

        {!loading && profileType == null && <Onboarding onSelect={selectProfile} />}
        {emergencyOpen && <EmergencySheet onClose={() => setEmergencyOpen(false)} />}
      </div>
    </div>
  );
}
