@echo off
echo ========================================================
echo   DEPLOYMENT AUTOMATIQUE - ABRSON SERVICES
echo ========================================================
echo.
echo Cette fenetre va mettre votre site en ligne gratuitement et de facon permanente.
echo.
echo INSTRUCTIONS :
echo 1. Si c'est la premiere fois, entrez votre EMAIL et creez un MOT DE PASSE quand demande.
echo 2. Si le curseur ne bouge pas, tapez simplement (le mot de passe ne s'affiche pas pour la securite).
echo 3. Appuyez sur ENTREE pour valider.
echo.
echo Le site sera accessible a l'adresse qui s'affichera a la fin (ex: xxx.surge.sh).
echo.
echo Lancement du processus...
echo.

cmd /c "npx surge ."

echo.
echo ========================================================
echo   TERMINÉ ! Gardez le lien ci-dessus.
echo ========================================================
pause
