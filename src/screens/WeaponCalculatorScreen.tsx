import {useCallback, useEffect, useState} from "react"
import {Card, CardContent, Container, Grid, MenuItem, TextField, Typography} from "@mui/material";
import {Rank} from "../entities/rank.ts";
import {getFormattedNumber} from "../utils/getFormattedNumber.ts";
import ValueHandler from "../components/ValueHandler.tsx";
import {Potency} from "../entities/potency.ts";

const RANKS: string[] = Object.keys(Rank).filter((key) => Rank[key as keyof typeof Rank] <= Rank.G)


function WeaponCalculatorScreen() {
  const [swords, setSwords] = useState<Record<string, number>>({});
  const [targetRank, setTargetRank] = useState<Rank>(Rank.G);
  const [result, setResult] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(2.19 * Potency.Sp)

  const handleSwordChange = (rank: string, value: string) => {
    const new_num = parseInt(value, 10) || 0
    setSwords({ ...swords, [rank]: new_num });
  };

  const calculate = useCallback(() => {
    if (targetRank <= Rank.E) {
      setResult('Target must be higher then Rank E.');
      return;
    }

    let missing = 3;

    for (let rank: Rank = targetRank; rank > Rank.E; rank--) {

      const cur_rank_key = Object.values(Rank)[rank]
      const owned = swords[cur_rank_key] || 0

      if (rank == targetRank) {
        if (owned > 0) {
          setResult('Sword already received!')
          return
        }
        continue
      }

      const missing_cur_rank = missing - owned
      if (missing_cur_rank <= 0) {
        setResult(`You can already craft you sword beginning with Rank ${cur_rank_key}`)
        return
      }

      missing = 3 * missing_cur_rank
    }

    missing -= swords[Object.values(Rank)[Rank.E]] || 0
    setResult(`Missing E Swords: ${missing}\nCosts: ${getFormattedNumber(missing * price)}`);
  }, [price, swords, targetRank])

  useEffect(calculate, [calculate]);

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom align="center">
        Sword Rank Calculator
      </Typography>

      <Grid container spacing={2} marginTop={2}>
        {RANKS.map((rank) => (
          <Grid key={rank} size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label={`Amount - Rank ${rank}`}
              value={swords[rank] || ''}
              onChange={(e) => handleSwordChange(rank, e.target.value)}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} marginTop={4}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            label="Target Rank"
            fullWidth
            value={targetRank}
            onChange={(e) => setTargetRank(Number(e.target.value))}
          >
            {RANKS.map((rank) => Rank[rank as keyof typeof Rank] > Rank.E && (
              <MenuItem key={rank} value={Rank[rank as keyof typeof Rank]}>{rank}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <ValueHandler value={price} setValue={setPrice} valueLabel={'Sword Price'}
                      valueSize={5} potencySize={3} storeKey={'sword-price'} />
      </Grid>

      {result && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="body1" whiteSpace="pre-line">{result}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default WeaponCalculatorScreen;